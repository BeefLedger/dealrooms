var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";
import abiDecoder from "abi-decoder";
import * as MultiSigCompiled from "../ethereum/abi/MultiSigHashed.json";
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json";
import { getMultiSigContract } from "./chain/prefabContractFactory";
export const ERROR_MULTIPLE_SUBMISSION_EVENTS = "MULTIPLE_SUBMISSION_EVENTS";
export const ERROR_NO_SUBMISSION_FOUND = "NO_SUBMISSION_FOUND";
export const ERROR_NO_SUBMISSION_HASH_FOUND = "ERROR_NO_SUBMISSION_HASH_FOUND";
export const ERROR_NOT_MULTISIG_OWNER = "NOT_MULTISIG_OWNER";
export class MultiSigController {
    constructor(multiSigAddress, signer) {
        this._signer = signer;
        this._address = multiSigAddress;
    }
    // Fetch resources
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Connect to the contract with my signer
                this._contract = yield getMultiSigContract(this._address, this._signer);
                this._signerAddress = yield this._signer.getAddress();
            }
            catch (e) {
                throw Error(`Failed to get MultiSig contract: ${e}`);
            }
        });
    }
    makeHash(destinationAddress, abi, fnName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const encodedData = new ethers.utils.Interface(abi).functions[fnName].encode(params);
            return this._contract.makeHash(destinationAddress, 0, encodedData);
        });
    }
    submitMultiSigTransaction(destinationAddress, abi, fnName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check that the signer is an owner
            if (!(yield this.isaMemberOfMultiSig(this._signerAddress))) {
                throw new Error(ERROR_NOT_MULTISIG_OWNER);
            }
            //Make the transaction 
            const encodedData = new ethers.utils.Interface(abi).functions[fnName].encode(params);
            const transaction = yield this._contract.submitTransaction(destinationAddress, 0, encodedData, { gasLimit: new BigNumber("5999999") });
            const receipt = yield transaction.wait();
            //Obtain the transaction ID created in the multisig
            try {
                if (receipt.events) {
                    const result = yield MultiSigController.getSubmissionHash(receipt);
                    return result;
                }
                throw `No submission events`;
            }
            catch (e) {
                throw `Error getting submission results: ${e}`;
            }
        });
    }
    //Submit a multisig transaction that, when approved, sends a proposal transaction to a second multisig
    submitDuplexMultiSigProposal(secondaryMultiSigContract, destinationAddress, destinationAbi, destinationFnName, destinationParams) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check that the signer is an owner
            if (!(yield this.isaMemberOfMultiSig(this._signerAddress))) {
                throw new Error(ERROR_NOT_MULTISIG_OWNER);
            }
            const encodedData = new ethers.utils.Interface(destinationAbi).functions[destinationFnName].encode(destinationParams);
            return this.submitMultiSigTransaction(secondaryMultiSigContract, MultiSigCompiled.abi, "submitTransaction", [destinationAddress, 0, encodedData]);
        });
    }
    static getSubmissionHash(receipt) {
        var _a, _b;
        const submissionEvents = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.filter(evt => evt.event === 'Submission' || evt.event === 'Confirmation');
        if (submissionEvents) {
            if (submissionEvents.length > 0) {
                return ((_b = submissionEvents[0]) === null || _b === void 0 ? void 0 : _b.args).hash;
            }
        }
        throw new Error(ERROR_NO_SUBMISSION_FOUND);
    }
    static _makeMultiSigTransaction(rawInput) {
        return {
            hash: rawInput[0],
            data: rawInput[1],
            destination: rawInput[2],
            executed: rawInput[3],
            timestamp: rawInput[4],
        };
    }
    getTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = [];
            const transactionCount = (yield this._contract.transactionCount()).toNumber();
            for (let i = 0; i < transactionCount; i++) {
                const transaction = MultiSigController._makeMultiSigTransaction(yield this._contract.getTransactionByIdx(i));
                transactions.push(transaction);
            }
            return transactions;
        });
    }
    getConfirmations(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._contract.getConfirmations(hash);
        });
    }
    getTransaction(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return MultiSigController._makeMultiSigTransaction(yield this._contract.getTransaction(hash));
        });
    }
    isaMemberOfMultiSig(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            const owners = yield this._contract.getOwners();
            if (!owners.includes(addr)) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    static decodeParams(data, abi) {
        abiDecoder.addABI(abi);
        return abiDecoder.decodeMethod(data);
    }
    //TODO: Move this out
    static decodeDealRoomTransaction(encoded) {
        //Identify the method and parameters
        return MultiSigController.decodeParams(encoded, DealRoomCompiled.abi);
    }
    //TODO: Move this out
    static decodeMultiSigTransaction(encoded) {
        //Identify the method and parameters
        return MultiSigController.decodeParams(encoded, MultiSigCompiled.abi);
    }
}
