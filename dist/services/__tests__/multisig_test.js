var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { deployMultisig, deployTestContract } from "../../ethereum/deploy/deploy";
import { TESTRPC_ACCOUNTS } from "../../lib/settings";
import { MultiSigController } from "../multiSigController";
import { getProvider } from "../../services/chain/providerFactory";
import { BigNumber } from "ethers";
import * as TestContractCompiled from "../../ethereum/abi/TestContract.json";
var provider;
var signer1;
var signer2;
var multiSig;
var testContract;
var hash;
var multiSigAddress;
var signer3;
var signer4;
var signer5;
var signer1MultiSig;
var signer2MultiSig;
var signer3MultiSig1;
var signer4MultiSig1;
var signer5MultiSig2;
var multiSig1;
var multiSig2;
describe("Double-layer Multisig", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = getProvider();
                    signer3 = provider.getSigner(TESTRPC_ACCOUNTS[3].address);
                    signer4 = provider.getSigner(TESTRPC_ACCOUNTS[4].address);
                    signer5 = provider.getSigner(TESTRPC_ACCOUNTS[5].address);
                    return [4 /*yield*/, deployTestContract(signer3)];
                case 1:
                    testContract = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 10000);
    it("Deploy multisig 1 and 2", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect(1).toEqual(1);
                    return [4 /*yield*/, deployMultisig([
                            TESTRPC_ACCOUNTS[3].address,
                            TESTRPC_ACCOUNTS[4].address
                        ], 2, signer3)];
                case 1:
                    multiSig1 = _a.sent();
                    signer3MultiSig1 = new MultiSigController(multiSig1.address, signer3);
                    signer4MultiSig1 = new MultiSigController(multiSig1.address, signer4);
                    return [4 /*yield*/, signer3MultiSig1.init()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, signer4MultiSig1.init()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, deployMultisig([
                            TESTRPC_ACCOUNTS[5].address,
                            multiSig1.address
                        ], 2, signer5)];
                case 4:
                    multiSig2 = _a.sent();
                    expect(multiSig2).toBeDefined();
                    signer5MultiSig2 = new MultiSigController(multiSig2.address, signer5);
                    return [4 /*yield*/, signer5MultiSig2.init()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 10000);
    it("Submit duplex transaction to multisig 1", function () { return __awaiter(void 0, void 0, void 0, function () {
        var retrievedTransaction, fnCall, confirmations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signer3MultiSig1.submitDuplexMultiSigProposal(multiSig2.address, testContract.address, TestContractCompiled.abi, "doSomethingInt", [BigNumber.from(500)])];
                case 1:
                    hash = _a.sent();
                    expect(hash).toBeDefined();
                    return [4 /*yield*/, signer3MultiSig1.getTransaction(hash)];
                case 2:
                    retrievedTransaction = _a.sent();
                    fnCall = MultiSigController.decodeMultiSigTransaction(retrievedTransaction.data);
                    expect(retrievedTransaction.destination).toEqual(multiSig2.address);
                    expect(fnCall.name === "submitTransaction");
                    return [4 /*yield*/, signer3MultiSig1.getConfirmations(hash)];
                case 3:
                    confirmations = _a.sent();
                    expect(confirmations).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Second signature on multisig 1", function () { return __awaiter(void 0, void 0, void 0, function () {
        var confirmations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signer4MultiSig1.submitDuplexMultiSigProposal(multiSig2.address, testContract.address, TestContractCompiled.abi, "doSomethingInt", [BigNumber.from(500)])];
                case 1:
                    hash = _a.sent();
                    expect(hash).toBeDefined();
                    return [4 /*yield*/, signer4MultiSig1.getConfirmations(hash)];
                case 2:
                    confirmations = _a.sent();
                    expect(confirmations).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Final signature on contract 2", function () { return __awaiter(void 0, void 0, void 0, function () {
        var expectedHash, confirmations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signer5MultiSig2.makeHash(testContract.address, TestContractCompiled.abi, "doSomethingInt", [BigNumber.from(500)])];
                case 1:
                    expectedHash = _a.sent();
                    return [4 /*yield*/, signer5MultiSig2.getConfirmations(expectedHash)];
                case 2:
                    confirmations = _a.sent();
                    expect(confirmations).toHaveLength(1);
                    return [4 /*yield*/, signer5MultiSig2.submitMultiSigTransaction(testContract.address, TestContractCompiled.abi, "doSomethingInt", [BigNumber.from(500)])];
                case 3:
                    hash = _a.sent();
                    expect(hash).toEqual(expectedHash);
                    return [4 /*yield*/, signer5MultiSig2.getConfirmations(expectedHash)];
                case 4:
                    confirmations = _a.sent();
                    expect(confirmations).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Transaction executed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testContract.getSomethingInt()];
                case 1:
                    result = _a.sent();
                    expect(Number(result)).toEqual(500);
                    return [2 /*return*/];
            }
        });
    }); });
});
