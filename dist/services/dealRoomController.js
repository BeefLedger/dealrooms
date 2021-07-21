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
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json";
import * as Deployer from "../ethereum/deploy/deploy";
import { MultiSigController } from "./multiSigController";
import * as ContractFactory from "./chain/prefabContractFactory";
export var ERROR_ROOM_NOT_LOADED = "ROOM_NOT_LOADED";
export var ERROR_NO_AGENT_MULTISIG = "NO_AGENT_MULTISIG";
export var NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export var DealStatus = {
    Unknown: 0,
    Open: 1,
    Cancelled: 2,
    Settled: 3
};
var DealRoomController = /** @class */ (function () {
    //--- Instance methods, for use with a Controller constructed with a specific instance of a Room
    function DealRoomController(hubAddress, dealRoomAddress, signer) {
        this._signer = signer;
        this._dealRoomHubAddress = hubAddress;
        this._dealRoomAddress = dealRoomAddress;
    }
    //--- Public methods ------------------------------------- //
    //--- Static methods
    // Deploy a hub contract
    DealRoomController.deployHub = function (signer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Deployer.deployDealRoomHub(signer)];
            });
        });
    };
    // Deploy a room contract
    DealRoomController.deployRoom = function (params, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var dr, _a, _b, _c, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        _b = (_a = Deployer).deployDealRoom;
                        _c = [params];
                        return [4 /*yield*/, signer.getAddress()];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent(), signer]))];
                    case 2:
                        dr = _d.sent();
                        return [2 /*return*/, dr.addr];
                    case 3:
                        e_1 = _d.sent();
                        throw Error("_deployDealRoom: " + e_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Make a deal: Fetch or deploy the room contract, then create the deal
    DealRoomController.deployRoomAndDeal = function (roomParams, deal, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var deployedRoom, roomAddresses, _i, roomAddresses_1, roomAddress, room, roomContract, dealId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DealRoomController.getRooms(roomParams.dealRoomHubAddress, signer)];
                    case 1:
                        roomAddresses = _a.sent();
                        _i = 0, roomAddresses_1 = roomAddresses;
                        _a.label = 2;
                    case 2:
                        if (!(_i < roomAddresses_1.length)) return [3 /*break*/, 5];
                        roomAddress = roomAddresses_1[_i];
                        return [4 /*yield*/, DealRoomController.getRoomDetails(roomParams.dealRoomHubAddress, roomAddress, signer)];
                    case 3:
                        room = _a.sent();
                        if (room.seller === roomParams.seller) {
                            deployedRoom = room;
                            return [3 /*break*/, 5];
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        // If no pre-existing room, create a room and deal in the same transaction
                        if (!deployedRoom) {
                            return [2 /*return*/, Deployer.deployRoomAndDeal(roomParams, deal, signer)];
                        }
                        return [4 /*yield*/, ContractFactory.getDealRoomContract(deployedRoom.addr, signer)];
                    case 6:
                        roomContract = _a.sent();
                        return [4 /*yield*/, DealRoomController.makeRoomDeal(roomContract, deal, signer)];
                    case 7:
                        dealId = _a.sent();
                        return [2 /*return*/, {
                                roomAddress: deployedRoom.addr,
                                dealId: dealId
                            }];
                }
            });
        });
    };
    DealRoomController.deployBasicRoom = function (params, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var dr, _a, _b, _c, e_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        _b = (_a = Deployer).deployBasicDealRoom;
                        _c = [params];
                        return [4 /*yield*/, signer.getAddress()];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent(), signer]))];
                    case 2:
                        dr = _d.sent();
                        return [2 /*return*/, dr.addr];
                    case 3:
                        e_2 = _d.sent();
                        throw Error("_deployDealRoom: " + e_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Get a list of rooms from a hub
    DealRoomController.getRooms = function (hubAddress, signer, userAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var hubContract, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, ContractFactory.getDealRoomHubContract(hubAddress, signer)];
                    case 1:
                        hubContract = _d.sent();
                        _b = (_a = hubContract).getUserRooms;
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
    DealRoomController.getRoomDetails = function (hubAddress, roomAddress, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var hubContract, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ContractFactory.getDealRoomHubContract(hubAddress, signer)];
                    case 1:
                        hubContract = _a.sent();
                        return [4 /*yield*/, hubContract.getRoom(roomAddress)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DealRoomController.makeRoomDeal = function (room, deal, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var dealId, tx, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, room.getDealCount()];
                    case 1:
                        dealId = (_a.sent()).toNumber();
                        return [4 /*yield*/, room.makeDeal(deal.erc20, deal.erc721, deal.price, deal.assetItems)];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, dealId];
                }
            });
        });
    };
    // Fetch resources
    DealRoomController.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this._dealRoomAddress) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getDealRoomContract()];
                    case 1:
                        _a.dealRoomContract = _d.sent();
                        _d.label = 2;
                    case 2:
                        // Ask the deal room hub for all the details
                        _b = this;
                        return [4 /*yield*/, this._getDealRoomHubContract()];
                    case 3:
                        // Ask the deal room hub for all the details
                        _b.dealRoomHubContract = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this._getRoomDetails()];
                    case 4:
                        _c.details = _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DealRoomController.prototype.isBasic = function () {
        return this.details.agentMultiSig === NULL_ADDRESS;
    };
    DealRoomController.prototype.depositDealCoins = function (id, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, roomContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealTokenContract(id)];
                    case 1:
                        tokenContract = _a.sent();
                        return [4 /*yield*/, this._getDealRoomContract()];
                    case 2:
                        roomContract = _a.sent();
                        return [4 /*yield*/, tokenContract.transfer(roomContract.address, amount)];
                    case 3: return [2 /*return*/, (_a.sent()).wait()];
                }
            });
        });
    };
    DealRoomController.prototype.depositDealAssets = function (id, items) {
        return __awaiter(this, void 0, void 0, function () {
            var assetContract, roomContract, receipts, _i, items_1, item, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this._getDealAssetContract(id)];
                    case 1:
                        assetContract = _e.sent();
                        return [4 /*yield*/, this._getDealRoomContract()];
                    case 2:
                        roomContract = _e.sent();
                        receipts = [];
                        _i = 0, items_1 = items;
                        _e.label = 3;
                    case 3:
                        if (!(_i < items_1.length)) return [3 /*break*/, 8];
                        item = items_1[_i];
                        _b = (_a = receipts).push;
                        _d = (_c = assetContract).transferFrom;
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 4: return [4 /*yield*/, _d.apply(_c, [_e.sent(), roomContract.address, item])];
                    case 5: return [4 /*yield*/, (_e.sent()).wait()];
                    case 6:
                        _b.apply(_a, [_e.sent()]);
                        _e.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [2 /*return*/, receipts];
                }
            });
        });
    };
    DealRoomController.prototype.getMyTokenBalance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenContract, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._getDealTokenContract(id)];
                    case 1:
                        tokenContract = _c.sent();
                        _b = (_a = tokenContract).balanceOf;
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    DealRoomController.prototype.getMyAssetBalance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var assetContract, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._getDealAssetContract(id)];
                    case 1:
                        assetContract = _c.sent();
                        _b = (_a = assetContract).balanceOf;
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    DealRoomController.prototype.getAssetOwner = function (dealId, assetId) {
        return __awaiter(this, void 0, void 0, function () {
            var assetContract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealAssetContract(dealId)];
                    case 1:
                        assetContract = _a.sent();
                        return [2 /*return*/, assetContract.ownerOf(assetId)];
                }
            });
        });
    };
    DealRoomController.prototype.getDealRoomContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._getDealRoomContract()];
            });
        });
    };
    DealRoomController.prototype.getBuyer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, buyer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.getBuyer()];
                    case 2:
                        buyer = _a.sent();
                        return [2 /*return*/, buyer];
                }
            });
        });
    };
    DealRoomController.prototype.getSeller = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.getSeller()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DealRoomController.prototype.getAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._dealRoomAddress) return [3 /*break*/, 1];
                        return [2 /*return*/, this._dealRoomAddress];
                    case 1: return [4 /*yield*/, this._getDealRoomContract()];
                    case 2:
                        contract = _a.sent();
                        return [2 /*return*/, contract.address];
                }
            });
        });
    };
    DealRoomController.prototype.makeDeal = function (deal) {
        return __awaiter(this, void 0, void 0, function () {
            var dealRoom, dealId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        dealRoom = _a.sent();
                        return [4 /*yield*/, DealRoomController.makeRoomDeal(dealRoom, deal, this._signer)];
                    case 2:
                        dealId = _a.sent();
                        return [4 /*yield*/, this.getDeal(dealId)];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DealRoomController.prototype.getDeal = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, dealStruct, e_3, dealMultiSig, agentMultiSig, dealTransaction, dealConfirmations, agentTransaction, agentConfirmations, agentTransaction_1, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 14, , 15]);
                        return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        dealStruct = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, contract.getDeal(dealId)];
                    case 3:
                        dealStruct = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        throw new Error("Deal not found");
                    case 5: return [4 /*yield*/, this._getDealMultiSig()];
                    case 6:
                        dealMultiSig = _a.sent();
                        return [4 /*yield*/, this._getAgentMultiSig()];
                    case 7:
                        agentMultiSig = _a.sent();
                        return [4 /*yield*/, this._getDealSettleTransaction(dealId)];
                    case 8:
                        dealTransaction = _a.sent();
                        dealConfirmations = 0;
                        if (!dealTransaction) return [3 /*break*/, 10];
                        return [4 /*yield*/, dealMultiSig.getConfirmations(dealTransaction.hash)];
                    case 9:
                        dealConfirmations = (_a.sent()).length;
                        _a.label = 10;
                    case 10:
                        agentTransaction = null;
                        agentConfirmations = 0;
                        if (!(this.details.agentMultiSig !== NULL_ADDRESS)) return [3 /*break*/, 13];
                        if (!agentMultiSig) return [3 /*break*/, 13];
                        return [4 /*yield*/, this._getAgentDealSettleTransaction(dealId)]; //TODO: Optimise this
                    case 11:
                        agentTransaction_1 = _a.sent() //TODO: Optimise this
                        ;
                        if (!agentTransaction_1) return [3 /*break*/, 13];
                        return [4 /*yield*/, agentMultiSig.getConfirmations(agentTransaction_1.hash)];
                    case 12:
                        agentConfirmations = (_a.sent()).length;
                        _a.label = 13;
                    case 13: 
                    // Return the Deal
                    return [2 /*return*/, {
                            id: dealId,
                            erc20: dealStruct.erc20,
                            erc721: dealStruct.erc721,
                            price: dealStruct.price,
                            assetItems: dealStruct.assetItems.map(function (item) { return item.toNumber(); }),
                            dealTransaction: dealTransaction,
                            agentTransaction: agentTransaction,
                            dealConfirmations: dealConfirmations,
                            agentConfirmations: agentConfirmations,
                            status: dealStruct.status,
                        }];
                    case 14:
                        e_4 = _a.sent();
                        console.error(e_4);
                        return [2 /*return*/, null];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    DealRoomController.prototype.getDealCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.getDealCount()];
                    case 2: return [2 /*return*/, (_a.sent()).toNumber()];
                }
            });
        });
    };
    DealRoomController.prototype.getDeals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, dealCount, result, i, _a, _b, e_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _c.sent();
                        return [4 /*yield*/, this.getDealCount()];
                    case 2:
                        dealCount = _c.sent();
                        result = [];
                        i = 0;
                        _c.label = 3;
                    case 3:
                        if (!(i < dealCount)) return [3 /*break*/, 6];
                        _b = (_a = result).push;
                        return [4 /*yield*/, this.getDeal(i)];
                    case 4:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, result];
                    case 7:
                        e_5 = _c.sent();
                        throw Error("getDeals(): " + e_5);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    DealRoomController.prototype.getDealMissingAssets = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getDealMissingAssets(" + id + ")");
                        return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.missingDealAssets(id)];
                    case 2: return [2 /*return*/, (_a.sent()).toNumber()];
                }
            });
        });
    };
    DealRoomController.prototype.getDealAssetStatus = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var deal, results, _i, _a, assetId, owner, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getDeal(dealId)];
                    case 1:
                        deal = _b.sent();
                        results = [];
                        _i = 0, _a = deal.assetItems;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        assetId = _a[_i];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.getAssetOwner(dealId, assetId)];
                    case 4:
                        owner = _b.sent();
                        results.push({
                            assetId: BigNumber.from(assetId),
                            owner: owner
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        e_6 = _b.sent();
                        console.warn("Error getting asset status for " + assetId + ": " + e_6);
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, results];
                }
            });
        });
    };
    DealRoomController.prototype.getDealMissingCoins = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.missingDealCoins(id)];
                    case 2: return [2 /*return*/, (_a.sent()).toNumber()];
                }
            });
        });
    };
    DealRoomController.prototype.proposeSettleDeal = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = !this.isBasic();
                        if (!_a) return [3 /*break*/, 2];
                        _c = (_b = [this.details.arbitrator, this.details.buyer, this.details.seller]).includes;
                        return [4 /*yield*/, this.signerAddress()];
                    case 1:
                        _a = _c.apply(_b, [_d.sent()]);
                        _d.label = 2;
                    case 2:
                        if (_a) {
                            return [2 /*return*/, this._proposeAgentsSettleDeal(dealId)];
                        }
                        else {
                            return [2 /*return*/, this._proposeMainSettleDeal(dealId)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DealRoomController.prototype.cancelDeal = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, transaction, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.cancelDeal(dealId)];
                    case 2:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    DealRoomController.prototype.withdrawDealCoins = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, transaction, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.withdrawDealCoins(dealId)];
                    case 2:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    DealRoomController.prototype.withdrawDealAssets = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, deal, transaction, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getDealRoomContract()];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, this.getDeal(dealId)];
                    case 2:
                        deal = _a.sent();
                        return [4 /*yield*/, contract.withdrawDealAssets(dealId, deal.assetItems.length)];
                    case 3:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.wait()];
                    case 4:
                        receipt = _a.sent();
                        return [2 /*return*/, receipt];
                }
            });
        });
    };
    DealRoomController.prototype.getAgentMultiSigContractAddress = function () {
        return this.details.agentMultiSig;
    };
    DealRoomController.prototype.getDealMultiSigContractAddress = function () {
        return this.details.dealMultiSig;
    };
    //--- Private methods ------------------------------------- //
    DealRoomController.prototype.signerAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._signer.getAddress()];
            });
        });
    };
    // TODO: Cache the contract
    DealRoomController.prototype._getDealRoomContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ContractFactory.getDealRoomContract(this._dealRoomAddress, this._signer)];
                    case 1:
                        contract = _a.sent();
                        return [2 /*return*/, contract];
                    case 2:
                        e_7 = _a.sent();
                        throw Error("Failed to get DealRoom contract: " + e_7);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DealRoomController.prototype._getDealRoomHubContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contract, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        //If the contract hasn't been instantiated yet,
                        if (this._dealRoomHubAddress == undefined) {
                            throw Error("Deal room hub not yet created");
                        }
                        return [4 /*yield*/, ContractFactory.getDealRoomHubContract(this._dealRoomHubAddress, this._signer)];
                    case 1:
                        contract = _a.sent();
                        return [2 /*return*/, contract];
                    case 2:
                        e_8 = _a.sent();
                        throw Error("Failed to get DealRoom contract: " + e_8);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DealRoomController.prototype._getDealTokenContract = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDeal(id)];
                    case 1:
                        deal = _a.sent();
                        return [2 /*return*/, ContractFactory.getErc20Contract(deal.erc20, this._signer)];
                }
            });
        });
    };
    DealRoomController.prototype._getDealAssetContract = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDeal(id)];
                    case 1:
                        deal = _a.sent();
                        return [2 /*return*/, ContractFactory.getErc721Contract(deal.erc721, this._signer)];
                }
            });
        });
    };
    DealRoomController.prototype._getDealMultiSig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msController;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.details) {
                            throw new Error(ERROR_ROOM_NOT_LOADED);
                        }
                        msController = new MultiSigController(this.details.dealMultiSig, this._signer);
                        return [4 /*yield*/, msController.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, msController];
                }
            });
        });
    };
    DealRoomController.prototype._getAgentMultiSig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msController;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.details) {
                            throw new Error(ERROR_ROOM_NOT_LOADED);
                        }
                        if (!this.details.agentMultiSig) {
                            throw new Error(ERROR_NO_AGENT_MULTISIG);
                        }
                        msController = new MultiSigController(this.details.agentMultiSig, this._signer);
                        return [4 /*yield*/, msController.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, msController];
                }
            });
        });
    };
    DealRoomController.prototype._getRoomDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dealRoomHubContract.getRoom(this._dealRoomAddress)];
            });
        });
    };
    DealRoomController.prototype._getDealSettleTransaction = function (dealId) {
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
                                if (decodedTransaction.name === "settle" && Number(decodedTransaction.params[0].value) === Number(dealId))
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
    DealRoomController.prototype._getAgentDealSettleTransaction = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, multiSigContract, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        return [4 /*yield*/, this._getAgentMultiSig()];
                    case 1:
                        multiSigContract = _a.sent();
                        return [4 /*yield*/, multiSigContract.getTransactions()];
                    case 2:
                        transactions = _a.sent();
                        if (transactions.length) {
                            result = transactions.find(function (transaction) {
                                var decodedTransaction = MultiSigController.decodeMultiSigTransaction(transaction.data);
                                if (decodedTransaction.name === "submitTransaction") { //TODO: Also check encoded params are "settle", [dealId]
                                    return true;
                                }
                            });
                            return [2 /*return*/, result];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Send a new transaction to the main multisig to settle the deal
    DealRoomController.prototype._proposeMainSettleDeal = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var dealRoomContract, dealMultiSig, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDealRoomContract()];
                    case 1:
                        dealRoomContract = _a.sent();
                        return [4 /*yield*/, this._getDealMultiSig()];
                    case 2:
                        dealMultiSig = _a.sent();
                        return [4 /*yield*/, dealMultiSig.submitMultiSigTransaction(dealRoomContract.address, DealRoomCompiled.abi, "settle", [dealId])];
                    case 3:
                        hash = _a.sent();
                        console.log("Settle transaction hash for " + dealId + " is " + hash);
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    // Send a new transaction to the agents multisig to "approve" the deal in the main multisig
    DealRoomController.prototype._proposeAgentsSettleDeal = function (dealId) {
        return __awaiter(this, void 0, void 0, function () {
            var deal, agentMultiSig, roomContract, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDeal(dealId)];
                    case 1:
                        deal = _a.sent();
                        return [4 /*yield*/, this._getAgentMultiSig()];
                    case 2:
                        agentMultiSig = _a.sent();
                        return [4 /*yield*/, this._getDealRoomContract()
                            // Make a new agent proposal to approve deal settlement proposal
                        ];
                    case 3:
                        roomContract = _a.sent();
                        return [4 /*yield*/, agentMultiSig.submitDuplexMultiSigProposal(this.getDealMultiSigContractAddress(), roomContract.address, DealRoomCompiled.abi, "settle", [dealId])];
                    case 4:
                        hash = _a.sent();
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    return DealRoomController;
}());
export { DealRoomController };
