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
import { BigNumber, ethers } from "ethers";
import abiDecoder from "abi-decoder";
import * as MultiSigCompiled from "../ethereum/abi/MultiSigHashed.json";
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json";
import { getMultiSigContract } from "./chain/prefabContractFactory";
export var ERROR_MULTIPLE_SUBMISSION_EVENTS = "MULTIPLE_SUBMISSION_EVENTS";
export var ERROR_NO_SUBMISSION_FOUND = "NO_SUBMISSION_FOUND";
export var ERROR_NO_SUBMISSION_HASH_FOUND = "ERROR_NO_SUBMISSION_HASH_FOUND";
export var ERROR_NOT_MULTISIG_OWNER = "NOT_MULTISIG_OWNER";
var MultiSigController = /** @class */ (function () {
    function MultiSigController(multiSigAddress, signer) {
        this._signer = signer;
        this._address = multiSigAddress;
    }
    // Fetch resources
    MultiSigController.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        //Connect to the contract with my signer
                        _a = this;
                        return [4 /*yield*/, getMultiSigContract(this._address, this._signer)];
                    case 1:
                        //Connect to the contract with my signer
                        _a._contract = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        _b._signerAddress = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        throw Error("Failed to get MultiSig contract: " + e_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MultiSigController.prototype.makeHash = function (destinationAddress, abi, fnName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedData;
            return __generator(this, function (_a) {
                encodedData = new ethers.utils.Interface(abi).encodeFunctionData(fnName, params);
                //const encodedData = new ethers.utils.Interface(abi).functions[fnName].encode(params) 
                return [2 /*return*/, this._contract.makeHash(destinationAddress, 0, encodedData)];
            });
        });
    };
    MultiSigController.prototype.submitMultiSigTransaction = function (destinationAddress, abi, fnName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedData, transaction, receipt, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isaMemberOfMultiSig(this._signerAddress)];
                    case 1:
                        //Check that the signer is an owner
                        if (!(_a.sent())) {
                            throw new Error(ERROR_NOT_MULTISIG_OWNER);
                        }
                        encodedData = new ethers.utils.Interface(abi).encodeFunctionData(fnName, params);
                        return [4 /*yield*/, this._contract.submitTransaction(destinationAddress, 0, encodedData, { gasLimit: BigNumber.from("5999999") })];
                    case 2:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()
                            //Obtain the transaction ID created in the multisig
                        ];
                    case 3:
                        receipt = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        if (!receipt.events) return [3 /*break*/, 6];
                        return [4 /*yield*/, MultiSigController.getSubmissionHash(receipt)];
                    case 5:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 6: throw "No submission events";
                    case 7:
                        e_2 = _a.sent();
                        throw "Error getting submission results: " + e_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    //Submit a multisig transaction that, when approved, sends a proposal transaction to a second multisig
    MultiSigController.prototype.submitDuplexMultiSigProposal = function (secondaryMultiSigContract, destinationAddress, destinationAbi, destinationFnName, destinationParams) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isaMemberOfMultiSig(this._signerAddress)];
                    case 1:
                        //Check that the signer is an owner
                        if (!(_a.sent())) {
                            throw new Error(ERROR_NOT_MULTISIG_OWNER);
                        }
                        encodedData = new ethers.utils.Interface(destinationAbi).encodeFunctionData(destinationFnName, destinationParams);
                        //const encodedData = new ethers.utils.Interface(destinationAbi).functions[destinationFnName].encode(destinationParams)
                        return [2 /*return*/, this.submitMultiSigTransaction(secondaryMultiSigContract, MultiSigCompiled.abi, "submitTransaction", [destinationAddress, 0, encodedData])];
                }
            });
        });
    };
    MultiSigController.getSubmissionHash = function (receipt) {
        var _a, _b;
        var submissionEvents = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.filter(function (evt) { return evt.event === 'Submission' || evt.event === 'Confirmation'; });
        if (submissionEvents) {
            if (submissionEvents.length > 0) {
                return ((_b = submissionEvents[0]) === null || _b === void 0 ? void 0 : _b.args).hash;
            }
        }
        throw new Error(ERROR_NO_SUBMISSION_FOUND);
    };
    MultiSigController._makeMultiSigTransaction = function (rawInput) {
        return {
            hash: rawInput[0],
            data: rawInput[1],
            destination: rawInput[2],
            executed: rawInput[3],
            timestamp: rawInput[4],
        };
    };
    MultiSigController.prototype.getTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transactions, transactionCount, i, transaction, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        transactions = [];
                        return [4 /*yield*/, this._contract.transactionCount()];
                    case 1:
                        transactionCount = (_c.sent()).toNumber();
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < transactionCount)) return [3 /*break*/, 5];
                        _b = (_a = MultiSigController)._makeMultiSigTransaction;
                        return [4 /*yield*/, this._contract.getTransactionByIdx(i)];
                    case 3:
                        transaction = _b.apply(_a, [_c.sent()]);
                        transactions.push(transaction);
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, transactions];
                }
            });
        });
    };
    MultiSigController.prototype.getConfirmations = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._contract.getConfirmations(hash)];
            });
        });
    };
    MultiSigController.prototype.getTransaction = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = MultiSigController)._makeMultiSigTransaction;
                        return [4 /*yield*/, this._contract.getTransaction(hash)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    MultiSigController.prototype.isaMemberOfMultiSig = function (addr) {
        return __awaiter(this, void 0, void 0, function () {
            var owners;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._contract.getOwners()];
                    case 1:
                        owners = _a.sent();
                        if (!owners.includes(addr)) {
                            return [2 /*return*/, false];
                        }
                        else {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MultiSigController.decodeParams = function (data, abi) {
        abiDecoder.addABI(abi);
        return abiDecoder.decodeMethod(data);
    };
    //TODO: Move this out
    MultiSigController.decodeDealRoomTransaction = function (encoded) {
        //Identify the method and parameters
        return MultiSigController.decodeParams(encoded, DealRoomCompiled.abi);
    };
    //TODO: Move this out
    MultiSigController.decodeMultiSigTransaction = function (encoded) {
        //Identify the method and parameters
        return MultiSigController.decodeParams(encoded, MultiSigCompiled.abi);
    };
    return MultiSigController;
}());
export { MultiSigController };
