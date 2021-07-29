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
import { BigNumber } from "ethers";
import * as DealCompiled from "../../ethereum/abi/Deal.json";
import * as Deployer from "../../ethereum/deploy/deploy";
import { MultiSigController } from "../multiSigController";
import * as ContractFactory from "../chain/prefabContractFactory";
export var ERROR_DEAL_NOT_LOADED = "DEAL_NOT_LOADED";
export var ERROR_NO_MULTISIG = "NO_MULTISIG";
export var NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export var DealStatus = {
    Open: 0,
    Canceled: 1,
    Settled: 2
};
var DealController = /** @class */ (function () {
    //--- Instance methods, for use with a Controller constructed with a specific instance of a Room
    function DealController(hubAddress, signer) {
        this._signer = signer;
        this._dealHubAddress = hubAddress;
    }
    //--- Public methods ------------------------------------- //
    //--- Static methods
    // Deploy a hub contract
    DealController.deployHub = function (signer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Deployer.deployDealHub(signer)];
            });
        });
    };
    // Deploy a deal contract
    DealController.deployDeal = function (params, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _b = (_a = Deployer).deployDeal;
                        _c = [params];
                        return [4 /*yield*/, signer.getAddress()];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent(), signer]))];
                    case 2:
                        e_1 = _d.sent();
                        throw Error("_deployDealRoom: " + e_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get a list of deals from a hub
    DealController.getUserDeals = function (hubAddress, signer, userAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var hubContract, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, ContractFactory.getDealHubContract(hubAddress, signer)];
                    case 1:
                        hubContract = _d.sent();
                        _b = (_a = hubContract).getUserDeals;
                        if (!(userAddress !== null && userAddress !== void 0)) return [3 /*break*/, 2];
                        _c = userAddress;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, signer.getAddress()];
                    case 3:
                        _c = _d.sent();
                        _d.label = 4;
                    case 4: return [2 /*return*/, _b.apply(_a, [_c])];
                }
            });
        });
    };
    DealController.getDealListing = function (hubAddress, dealAddress, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var hubContract, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ContractFactory.getDealHubContract(hubAddress, signer)];
                    case 1:
                        hubContract = _a.sent();
                        return [4 /*yield*/, hubContract.getDeal(dealAddress)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DealController.makeDeal = function (hub, deal, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, rcpt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hub.makeDeal(deal.buyer, deal.seller, deal.erc20, deal.erc721, deal.price, deal.assetItems)];
                    case 1:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 2:
                        rcpt = _a.sent();
                        return [2 /*return*/, rcpt.contractAddress];
                }
            });
        });
    };
    //Load a pre-existing deal and initialise
    DealController.prototype.initWithDeal = function (dealAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getDealContract()];
                    case 1:
                        _a.dealContract = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.getDeal(dealAddress)];
                    case 2:
                        _b.deal = _c.sent();
                        this.init();
                        return [2 /*return*/];
                }
            });
        });
    };
    //Create a new deal and initialise
    DealController.prototype.initWithNewDeal = function (deal) {
        return __awaiter(this, void 0, void 0, function () {
            var dealAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DealController.makeDeal(this.dealHubContract, deal, this._signer)];
                    case 1:
                        dealAddress = _a.sent();
                        return [2 /*return*/, this.initWithDeal(dealAddress)];
                }
            });
        });
    };
    DealController.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.deal) {
                            throw new Error(ERROR_DEAL_NOT_LOADED);
                        }
                        // Ask the deal room hub for all the details
                        _a = this;
                        return [4 /*yield*/, this._getDealHubContract()];
                    case 1:
                        // Ask the deal room hub for all the details
                        _a.dealHubContract = _f.sent();
                        _b = this;
                        return [4 /*yield*/, this._getDealListing()];
                    case 2:
                        _b.dealListing = _f.sent();
                        _c = this;
                        return [4 /*yield*/, this._getDealContract()];
                    case 3:
                        _c.dealContract = _f.sent();
                        _d = this;
                        return [4 /*yield*/, this._getDealAssetContract()];
                    case 4:
                        _d.dealAssetContract = _f.sent();
                        _e = this;
                        return [4 /*yield*/, this._getDealCoinContract()];
                    case 5:
                        _e.dealCoinContract = _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DealController.prototype.depositDealCoins = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dealCoinContract.transfer(this.dealContract.address, amount)];
                    case 1: return [2 /*return*/, (_a.sent()).wait()];
                }
            });
        });
    };
    DealController.prototype.depositDealAssets = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var receipts, _i, items_1, item, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        receipts = [];
                        _i = 0, items_1 = items;
                        _e.label = 1;
                    case 1:
                        if (!(_i < items_1.length)) return [3 /*break*/, 6];
                        item = items_1[_i];
                        _b = (_a = receipts).push;
                        _d = (_c = this.dealAssetContract).transferFrom;
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2: return [4 /*yield*/, _d.apply(_c, [_e.sent(), this.dealContract.address, item])];
                    case 3: return [4 /*yield*/, (_e.sent()).wait()];
                    case 4:
                        _b.apply(_a, [_e.sent()]);
                        _e.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, receipts];
                }
            });
        });
    };
    DealController.prototype.getMyCoinBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = this.dealCoinContract).balanceOf;
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    DealController.prototype.getMyAssetBalance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = this.dealAssetContract).balanceOf;
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    DealController.prototype.getAssetOwner = function (assetId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dealAssetContract.ownerOf(assetId)];
            });
        });
    };
    DealController.prototype.getDealContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._getDealContract()];
            });
        });
    };
    DealController.prototype.getBuyer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dealContract.getBuyer()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DealController.prototype.getSeller = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dealContract.getSeller()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DealController.prototype.getAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._dealAddress) return [3 /*break*/, 1];
                        return [2 /*return*/, this._dealAddress];
                    case 1: return [4 /*yield*/, this._getDealContract()];
                    case 2:
                        contract = _a.sent();
                        return [2 /*return*/, contract.address];
                }
            });
        });
    };
    DealController.prototype.getDeal = function (dealAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var dealStruct, e_2, dealMultiSig, dealTransaction, dealConfirmations, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.deal) {
                            return [2 /*return*/, this.deal];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        dealStruct = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.dealContract.getDeal()];
                    case 3:
                        dealStruct = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        throw new Error("Deal not found");
                    case 5: return [4 /*yield*/, this._getDealMultiSig()];
                    case 6:
                        dealMultiSig = _a.sent();
                        return [4 /*yield*/, this._getDealSettleTransaction()];
                    case 7:
                        dealTransaction = _a.sent();
                        dealConfirmations = 0;
                        if (!dealTransaction) return [3 /*break*/, 9];
                        return [4 /*yield*/, dealMultiSig.getConfirmations(dealTransaction.hash)];
                    case 8:
                        dealConfirmations = (_a.sent()).length;
                        _a.label = 9;
                    case 9: 
                    // Return the Deal
                    return [2 /*return*/, {
                            buyer: dealStruct.buyer,
                            seller: dealStruct.seller,
                            erc20: dealStruct.erc20,
                            erc721: dealStruct.erc721,
                            price: dealStruct.price,
                            assetItems: dealStruct.assetItems.map(function (item) { return item.toNumber(); }),
                            dealTransaction: dealTransaction,
                            dealConfirmations: dealConfirmations,
                            status: dealStruct.status,
                        }];
                    case 10:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [2 /*return*/, null];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    DealController.prototype.getDeals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, dealAddresses, _a, _b, result, _i, dealAddresses_1, dealAddress, _c, _d, e_4;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this._getDealHubContract()];
                    case 1:
                        contract = _e.sent();
                        _b = (_a = contract).getUserDeals;
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_e.sent()])];
                    case 3:
                        dealAddresses = _e.sent();
                        result = [];
                        _i = 0, dealAddresses_1 = dealAddresses;
                        _e.label = 4;
                    case 4:
                        if (!(_i < dealAddresses_1.length)) return [3 /*break*/, 7];
                        dealAddress = dealAddresses_1[_i];
                        _d = (_c = result).push;
                        return [4 /*yield*/, this.getDeal(dealAddress)];
                    case 5:
                        _d.apply(_c, [_e.sent()]);
                        _e.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, result];
                    case 8:
                        e_4 = _e.sent();
                        throw Error("getDeals(): " + e_4);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    DealController.prototype.getDealMissingAssets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dealContract];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.missingDealAssets()];
                    case 2: return [2 /*return*/, (_a.sent()).toNumber()];
                }
            });
        });
    };
    DealController.prototype.getDealAssetStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, _a, assetId, owner, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        results = [];
                        _i = 0, _a = this.deal.assetItems;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        assetId = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.getAssetOwner(assetId)];
                    case 3:
                        owner = _b.sent();
                        results.push({
                            assetId: BigNumber.from(assetId),
                            owner: owner
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_5 = _b.sent();
                        console.warn("Error getting asset status for " + assetId + ": " + e_5);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, results];
                }
            });
        });
    };
    DealController.prototype.getDealMissingCoins = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.missingDealCoins()];
                    case 2: return [2 /*return*/, (_a.sent()).toNumber()];
                }
            });
        });
    };
    DealController.prototype.proposeSettleDeal = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._proposeMainSettleDeal()];
            });
        });
    };
    DealController.prototype.withdrawDealCoins = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dealContract.withdrawDealCoins()];
                    case 1:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()];
                    case 2:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    DealController.prototype.withdrawDealAssets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dealContract.withdrawDealAssets(this.deal.assetItems.length)];
                    case 1:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()];
                    case 2:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    /*public getAgentMultiSigContractAddress(): string {
        return this.details.agentMultiSig
    }*/
    DealController.prototype.getDealMultiSigContractAddress = function () {
        return this.dealListing.dealMultiSig;
    };
    //--- Private methods ------------------------------------- //
    DealController.prototype.signerAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._signer.getAddress()];
            });
        });
    };
    // TODO: Cache the contract
    DealController.prototype._getDealContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ContractFactory.getDealContract(this._dealAddress, this._signer)];
                    case 1:
                        contract = _a.sent();
                        return [2 /*return*/, contract];
                    case 2:
                        e_6 = _a.sent();
                        throw Error("Failed to get DealRoom contract: " + e_6);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DealController.prototype._getDealHubContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        //If the contract hasn't been instantiated yet,
                        if (this._dealHubAddress == undefined) {
                            throw Error("Deal Hub not yet created");
                        }
                        return [4 /*yield*/, ContractFactory.getDealHubContract(this._dealHubAddress, this._signer)];
                    case 1:
                        contract = _a.sent();
                        return [2 /*return*/, contract];
                    case 2:
                        e_7 = _a.sent();
                        throw Error("Failed to get Deal Hub contract: " + e_7);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DealController.prototype._getDealCoinContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ContractFactory.getErc20Contract(this.deal.erc20, this._signer)];
            });
        });
    };
    DealController.prototype._getDealAssetContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ContractFactory.getErc721Contract(this.deal.erc721, this._signer)];
            });
        });
    };
    DealController.prototype._getDealMultiSig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msController;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.dealListing) {
                            throw new Error(ERROR_DEAL_NOT_LOADED);
                        }
                        msController = new MultiSigController(this.dealListing.dealMultiSig, this._signer);
                        return [4 /*yield*/, msController.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, msController];
                }
            });
        });
    };
    /*private async _getAgentMultiSig(): Promise<MultiSigController> {
        if (!this.dealListing) {
            throw new Error(ERROR_ROOM_NOT_LOADED)
        }
        if (!this.dealListing.agentMultiSig) {
            throw new Error(ERROR_NO_AGENT_MULTISIG)
        }
        const msController: MultiSigController = new MultiSigController(this.details.agentMultiSig, this._signer)
        await msController.init()
        return msController
    }*/
    DealController.prototype._getDealListing = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dealHubContract.getDeal(this._dealAddress)];
            });
        });
    };
    DealController.prototype._getDealSettleTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, multiSigContract, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        return [4 /*yield*/, this._getDealMultiSig()
                            // Find transaction that corresponds to settle(dealId)
                        ];
                    case 1:
                        multiSigContract = _a.sent();
                        return [4 /*yield*/, multiSigContract.getTransactions()];
                    case 2:
                        transactions = _a.sent();
                        if (transactions.length) {
                            result = transactions.find(function (transaction) {
                                var decodedTransaction = MultiSigController.decodeDealRoomTransaction(transaction.data);
                                if (decodedTransaction.name === "settle")
                                    return true;
                            });
                            return [2 /*return*/, result !== null && result !== void 0 ? result : null];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /*private async _getAgentDealSettleTransaction(dealId: BigNumberish): Promise<MultiSigTransaction | null> {
        let result: MultiSigTransaction = null
        const multiSigContract = await this._getAgentMultiSig()
        const transactions = await multiSigContract.getTransactions()
        if (transactions.length) {
            result = transactions.find((transaction: MultiSigTransaction) => {
                const decodedTransaction = MultiSigController.decodeMultiSigTransaction(transaction.data)
                if (decodedTransaction.name === "submitTransaction") { //TODO: Also check encoded params are "settle", [dealId]
                    return true
                }
            })
            return result
        } else {
            return null
        }
    }*/
    // Send a new transaction to the deal multisig to settle the deal
    DealController.prototype._proposeMainSettleDeal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dealContract, dealMultiSig, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDealContract()];
                    case 1:
                        dealContract = _a.sent();
                        return [4 /*yield*/, this._getDealMultiSig()];
                    case 2:
                        dealMultiSig = _a.sent();
                        return [4 /*yield*/, dealMultiSig.submitMultiSigTransaction(dealContract.address, DealCompiled.abi, "settle", [])];
                    case 3:
                        hash = _a.sent();
                        console.log("Settle transaction hash is " + hash);
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    return DealController;
}());
export { DealController };
