var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { deployMultisig, deployTestContract } from "../../ethereum/deploy/deploy";
import { TESTRPC_ACCOUNTS } from "../../lib/settings";
import { MultiSigController } from "../multiSigController";
import { getProvider } from "../../services/chain/providerFactory";
import { BigNumber } from "ethers";
import * as TestContractCompiled from "../../ethereum/abi/TestContract.json";
let provider;
let signer1;
let signer2;
let multiSig;
let testContract;
let hash;
let multiSigAddress;
let signer3;
let signer4;
let signer5;
let signer1MultiSig;
let signer2MultiSig;
let signer3MultiSig1;
let signer4MultiSig1;
let signer5MultiSig2;
let multiSig1;
let multiSig2;
describe("Double-layer Multisig", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        provider = getProvider();
        signer3 = provider.getSigner(TESTRPC_ACCOUNTS[3].address);
        signer4 = provider.getSigner(TESTRPC_ACCOUNTS[4].address);
        signer5 = provider.getSigner(TESTRPC_ACCOUNTS[5].address);
        testContract = yield deployTestContract(signer3);
    }), 10000);
    it("Deploy multisig 1 and 2", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(1).toEqual(1);
        multiSig1 = yield deployMultisig([
            TESTRPC_ACCOUNTS[3].address,
            TESTRPC_ACCOUNTS[4].address
        ], 2, signer3);
        signer3MultiSig1 = new MultiSigController(multiSig1.address, signer3);
        signer4MultiSig1 = new MultiSigController(multiSig1.address, signer4);
        yield signer3MultiSig1.init();
        yield signer4MultiSig1.init();
        multiSig2 = yield deployMultisig([
            TESTRPC_ACCOUNTS[5].address,
            multiSig1.address
        ], 2, signer5);
        expect(multiSig2).toBeDefined();
        signer5MultiSig2 = new MultiSigController(multiSig2.address, signer5);
        yield signer5MultiSig2.init();
    }), 10000);
    it("Submit duplex transaction to multisig 1", () => __awaiter(void 0, void 0, void 0, function* () {
        hash = yield signer3MultiSig1.submitDuplexMultiSigProposal(multiSig2.address, testContract.address, TestContractCompiled.abi, "doSomethingInt", [BigNumber.from(500)]);
        expect(hash).toBeDefined();
        let retrievedTransaction = yield signer3MultiSig1.getTransaction(hash);
        let fnCall = MultiSigController.decodeMultiSigTransaction(retrievedTransaction.data);
        expect(retrievedTransaction.destination).toEqual(multiSig2.address);
        expect(fnCall.name === "submitTransaction");
        let confirmations = yield signer3MultiSig1.getConfirmations(hash);
        expect(confirmations).toHaveLength(1);
    }));
    it("Second signature on multisig 1", () => __awaiter(void 0, void 0, void 0, function* () {
        hash = yield signer4MultiSig1.submitDuplexMultiSigProposal(multiSig2.address, testContract.address, TestContractCompiled.abi, "doSomethingInt", [BigNumber.from(500)]);
        expect(hash).toBeDefined();
        let confirmations = yield signer4MultiSig1.getConfirmations(hash);
        expect(confirmations).toHaveLength(2);
    }));
    it("Final signature on contract 2", () => __awaiter(void 0, void 0, void 0, function* () {
        //Find out what the hash on contract 2 should be
        let expectedHash = yield signer5MultiSig2.makeHash(testContract.address, TestContractCompiled.abi, "doSomethingInt", [BigNumber.from(500)]);
        let confirmations = yield signer5MultiSig2.getConfirmations(expectedHash);
        expect(confirmations).toHaveLength(1);
        hash = yield signer5MultiSig2.submitMultiSigTransaction(testContract.address, TestContractCompiled.abi, "doSomethingInt", [BigNumber.from(500)]);
        expect(hash).toEqual(expectedHash);
        confirmations = yield signer5MultiSig2.getConfirmations(expectedHash);
        expect(confirmations).toHaveLength(2);
    }));
    it("Transaction executed", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield testContract.getSomethingInt();
        expect(Number(result)).toEqual(500);
    }));
});
