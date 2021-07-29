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
var _a, _b;
import { BigNumber } from "ethers";
import { IERC20 } from "../ethereum/types/IERC20";
import { Deal as DealContract } from "../ethereum/types/Deal";
import { IERC721 } from "../ethereum/types/IERC721";
import * as DealCompiled from "../ethereum/abi/Deal.json";
import * as Deployer from "../ethereum/deploy/deploy";
import { DealHub } from "../ethereum/types/DealHub";
import { MultiSigController } from "./multiSigController";
import * as ContractFactory from "./chain/prefabContractFactory";
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
            var params, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        params = {
                            dealHubAddress: hub.address,
                            buyer: deal.buyer,
                            seller: deal.seller,
                            erc20: deal.erc20,
                            erc721: deal.erc721,
                            price: deal.price,
                            assetItems: deal.assetItems
                        };
                        _b = (_a = Deployer).deployDeal;
                        _c = [params];
                        return [4 /*yield*/, signer.getAddress()];
                    case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent(), signer]))];
                }
            });
        });
    };
    //Load a pre-existing deal and initialise
    DealController.prototype.initWithDeal = function (dealAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!!this.dealHubContract) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, ContractFactory.getDealHubContract(this._dealHubAddress, this._signer)];
                    case 1:
                        _a.dealHubContract = _d.sent();
                        _d.label = 2;
                    case 2:
                        this.init();
                        this._dealAddress = dealAddress;
                        _b = this;
                        return [4 /*yield*/, ContractFactory.getDealContract(dealAddress, this._signer)];
                    case 3:
                        _b.dealContract = _d.sent();
                        _c = this;
                        return [4 /*yield*/, this.getDeal()];
                    case 4:
                        _c.deal = _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //Create a new deal and initialise
    DealController.prototype.initWithNewDeal = function (deal) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        debugger;
                        _a = this;
                        return [4 /*yield*/, ContractFactory.getDealHubContract(this._dealHubAddress, this._signer)];
                    case 1:
                        _a.dealHubContract = _c.sent();
                        _b = this;
                        return [4 /*yield*/, DealController.makeDeal(this.dealHubContract, deal, this._signer)];
                    case 2:
                        _b._dealAddress = _c.sent();
                        return [2 /*return*/, this.initWithDeal(this._dealAddress)];
                }
            });
        });
    };
    DealController.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DealController;
}()); //
export { DealController };
// Ask the deal room hub for all the details
this.dealHubContract = await this._getDealHubContract();
this.dealListing = await this._getDealListing();
this.dealContract = await this._getDealContract();
this.dealAssetContract = await this._getDealAssetContract();
this.dealCoinContract = await this._getDealCoinContract();
async;
depositDealCoins(amount, BigNumberish);
Promise < ContractReceipt > {
    : .dealCoinContract.transfer(this.dealContract.address, amount), : .wait()
};
public;
async;
depositDealAssets(items, BigNumberish[]);
Promise < ContractReceipt[] > (_a = {
        const: receipts,
        ContractReceipt: ContractReceipt
    },
    _a[] =  = [],
    _a.for = function (, item, of, items) {
        receipts.push(await(yield this.dealAssetContract.transferFrom(yield this._signer.getAddress(), this.dealContract.address, item)).wait());
    },
    _a.return = receipts,
    _a);
async;
getMyCoinBalance();
Promise < BigNumberish > {
    return: this.dealCoinContract.balanceOf(await this._signer.getAddress())
};
async;
getMyAssetBalance(id, BigNumberish);
Promise < BigNumberish > {
    return: this.dealAssetContract.balanceOf(await this._signer.getAddress())
};
async;
getAssetOwner(assetId, BigNumberish);
Promise < string > {
    return: this.dealAssetContract.ownerOf(assetId)
};
async;
getDealContract();
Promise < DealContract > {
    return: this._getDealContract()
};
async;
getBuyer();
Promise < string > {
    return: await this.dealContract.getBuyer()
};
async;
getSeller();
Promise < string > {
    return: await this.dealContract.getSeller()
};
async;
getAddress();
Promise < string > {
    : ._dealAddress
};
{
    return this._dealAddress;
}
{
    var contract_1 = await this._getDealContract();
    return contract_1.address;
}
async;
getDeal();
Promise < Deal > {
    : .deal
};
{
    return this.deal;
}
try {
    var dealStruct = void 0;
    try {
        dealStruct = await this.dealContract.getDeal();
    }
    catch (e) {
        throw new Error("Deal not found");
    }
    // Get multisig from Room
    var dealMultiSig = await this._getDealMultiSig();
    // Get deal transaction and confirmations (if any) from main multisig
    var dealTransaction = await this._getDealSettleTransaction();
    var dealConfirmations = 0;
    if (dealTransaction) {
        dealConfirmations = (await dealMultiSig.getConfirmations(dealTransaction.hash)).length;
    }
    // Return the Deal
    return {
        addr: this._dealAddress,
        buyer: dealStruct.buyer,
        seller: dealStruct.seller,
        erc20: dealStruct.erc20,
        erc721: dealStruct.erc721,
        price: dealStruct.price,
        assetItems: dealStruct.assetItems.map(function (item) { return item.toNumber(); }),
        dealTransaction: dealTransaction,
        dealConfirmations: dealConfirmations,
        status: dealStruct.status,
    };
}
catch (e) {
    console.error("Failed to find deal:", e);
    return null;
}
async;
getDealMissingAssets();
Promise < number > {
    const: contract = await this.dealContract,
    return: function (await, contract) { },
    : .missingDealAssets(), : .toNumber()
};
public;
async;
getDealAssetStatus();
Promise < AssetStatus[] > (_b = {
        const: results,
        AssetStatus: AssetStatus
    },
    _b[] =  = [],
    _b. = .deal.assetItems,
    _b);
{
    try {
        var owner = await this.getAssetOwner(assetId);
        results.push({
            assetId: BigNumber.from(assetId),
            owner: owner
        });
    }
    catch (e) {
        console.warn("Error getting asset status for " + assetId + ": " + e);
    }
}
return results;
async;
getDealMissingCoins();
Promise < number > {
    const: contract = await this._getDealContract(),
    return: function (await, contract) { },
    : .missingDealCoins(), : .toNumber()
};
public;
async;
proposeSettleDeal();
Promise < string > {
    return: this._proposeMainSettleDeal()
};
async;
withdrawDealCoins();
Promise < ContractReceipt > {
    const: transaction = await this.dealContract.withdrawDealCoins(),
    const: receipt = await transaction.wait(),
    return: receipt
};
async;
withdrawDealAssets();
Promise < ContractReceipt > {
    //const contract = await this._getDealRoomContract()
    //const deal = await this.getDeal(dealId)
    const: transaction = await this.dealContract.withdrawDealAssets(this.deal.assetItems.length),
    const: receipt = await transaction.wait(),
    return: receipt
};
getDealMultiSigContractAddress();
string;
{
    return this.dealListing.dealMultiSig;
}
async;
signerAddress();
Promise < string > {
    return: this._signer.getAddress()
};
async;
_getDealContract();
Promise < DealContract > {
    try: {
        //Connect to the contract with my signer
        const: contract = await ContractFactory.getDealContract(this._dealAddress, this._signer),
        return: contract
    },
    catch: function (e) {
        throw Error("Failed to get DealRoom contract: " + e);
    }
};
async;
_getDealHubContract();
Promise < DealHub > {
    try: {
        : ._dealHubAddress == undefined
    }
};
{
    throw Error("Deal Hub not yet created");
}
//Connect to the contract with my signer
var contract = await ContractFactory.getDealHubContract(this._dealHubAddress, this._signer);
return contract;
try {
}
catch (e) {
    throw Error("Failed to get Deal Hub contract: " + e);
}
async;
_getDealCoinContract();
Promise < IERC20 > {
    return: ContractFactory.getErc20Contract(this.deal.erc20, this._signer)
};
async;
_getDealAssetContract();
Promise < IERC721 > {
    return: ContractFactory.getErc721Contract(this.deal.erc721, this._signer)
};
async;
_getDealMultiSig();
Promise < MultiSigController > {
    : .dealListing
};
{
    throw new Error(ERROR_DEAL_NOT_LOADED);
}
var msController = new MultiSigController(this.dealListing.dealMultiSig, this._signer);
await msController.init();
return msController;
async;
_getDealListing();
Promise < DealListing > {
    return: this.dealHubContract.getDeal(this._dealAddress)
};
async;
_getDealSettleTransaction();
Promise < MultiSigTransaction | null > {
    let: let,
    result: MultiSigTransaction = null,
    const: multiSigContract = await this._getDealMultiSig()
    // Find transaction that corresponds to settle(dealId)
    ,
    // Find transaction that corresponds to settle(dealId)
    const: transactions = await multiSigContract.getTransactions(),
    if: function (transactions) { },
    : .length
};
{
    result = transactions.find(function (transaction) {
        var decodedTransaction = MultiSigController.decodeDealRoomTransaction(transaction.data);
        if (decodedTransaction.name === "settle")
            return true;
    });
    return result !== null && result !== void 0 ? result : null;
}
{
    return null;
}
async;
_proposeMainSettleDeal();
Promise < string > {
    const: dealContract,
    DealContract: DealContract,
    const: dealMultiSig,
    MultiSigController: MultiSigController,
    const: hash = await dealMultiSig.submitMultiSigTransaction(dealContract.address, DealCompiled.abi, "settle", []),
    console: console,
    : .log("Settle transaction hash is " + hash),
    return: hash
};
