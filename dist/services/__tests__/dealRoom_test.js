var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import * as ethers from "ethers";
import { ADMIN, TESTRPC_ACCOUNTS } from "../../lib/settings";
import { getProvider } from "../../services/chain/providerFactory";
import { DealRoomController, DealStatus } from "../../services/dealRoomController";
import { setupTest } from "../../lib/testSetup";
var dealRoomController;
var demoEnvironment;
var dealRoomHubAddress;
var provider;
var sellerOriginalCoinBalance;
var buyerOriginalAssetBalance;
var MINUTE_MS = 60 * 1000;
var ROOM_1 = {
    buyer: TESTRPC_ACCOUNTS[5].address,
    seller: TESTRPC_ACCOUNTS[6].address,
    arbitrator: TESTRPC_ACCOUNTS[1].address,
    docApprover: TESTRPC_ACCOUNTS[3].address,
    sensorApprover: TESTRPC_ACCOUNTS[2].address,
};
var deal1;
var roomAddress;
describe("Deploy dealroom", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getProvider()];
                case 1:
                    //Deploy ERC20 and ERC720, mint some and assign them
                    provider = _a.sent();
                    return [4 /*yield*/, setupTest(TESTRPC_ACCOUNTS[1].address, TESTRPC_ACCOUNTS)];
                case 2:
                    demoEnvironment = _a.sent();
                    dealRoomHubAddress = demoEnvironment.deployedEnvironment.DealRoomHub.address;
                    return [4 /*yield*/, demoEnvironment.deployedEnvironment.erc20.balanceOf(ROOM_1.seller)];
                case 3:
                    sellerOriginalCoinBalance = _a.sent();
                    return [4 /*yield*/, demoEnvironment.deployedEnvironment.erc721.balanceOf(ROOM_1.buyer)];
                case 4:
                    buyerOriginalAssetBalance = _a.sent();
                    expect(dealRoomHubAddress).toBeDefined();
                    expect(demoEnvironment).toBeDefined();
                    expect(demoEnvironment.deployedEnvironment).toBeDefined();
                    expect(demoEnvironment.deployedEnvironment.DealRoomHub).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Makes a room", function () { return __awaiter(void 0, void 0, void 0, function () {
        var dealRoomCreateParams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomCreateParams = __assign({ dealRoomHubAddress: dealRoomHubAddress }, ROOM_1);
                    return [4 /*yield*/, DealRoomController.deployRoom(dealRoomCreateParams, provider.getSigner(ADMIN))];
                case 1:
                    roomAddress = _a.sent();
                    expect(roomAddress).toBeDefined();
                    expect(roomAddress.length).toEqual(42);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Makes a deal", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
                    expect(dealRoomController).toBeDefined();
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    deal1 = {
                        erc20: demoEnvironment.deployedEnvironment.erc20.address,
                        erc721: demoEnvironment.deployedEnvironment.erc721.address,
                        price: ethers.BigNumber.from(100),
                        assetItems: demoEnvironment.erc721Allocations[ROOM_1.seller]
                    };
                    return [4 /*yield*/, dealRoomController.makeDeal(deal1)];
                case 2:
                    deal1 = _a.sent();
                    return [4 /*yield*/, dealRoomController.getDeal(deal1.id)];
                case 3:
                    deal1 = _a.sent();
                    expect(deal1.agentConfirmations).toEqual(0);
                    expect(deal1.dealConfirmations).toEqual(0);
                    expect(deal1.status).toBe(DealStatus.Open);
                    expect(deal1.id).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); }, 10 * MINUTE_MS);
    it("Sensor: propose dummy settlement without effect", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ms, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.sensorApprover));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.proposeSettleDeal(ethers.BigNumber.from(1000))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDeal(deal1.id)];
                case 3:
                    deal1 = _a.sent();
                    return [4 /*yield*/, dealRoomController._getDealMultiSig()];
                case 4:
                    ms = _a.sent();
                    return [4 /*yield*/, ms.getTransactions()];
                case 5:
                    transactions = _a.sent();
                    expect(deal1.dealConfirmations).toEqual(0);
                    expect(deal1.status).toBe(DealStatus.Open);
                    return [2 /*return*/];
            }
        });
    }); }, 10 * MINUTE_MS);
    it("Agent: seller deposit assets", function () { return __awaiter(void 0, void 0, void 0, function () {
        var missingAssets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.depositDealAssets(deal1.id, deal1.assetItems)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDealMissingAssets(deal1.id)];
                case 3:
                    missingAssets = _a.sent();
                    expect(missingAssets).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Agent: seller withdraw assets before settlement", function () { return __awaiter(void 0, void 0, void 0, function () {
        var missingAssets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.withdrawDealAssets(deal1.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDealMissingAssets(deal1.id)];
                case 3:
                    missingAssets = _a.sent();
                    expect(missingAssets).toEqual(deal1.assetItems.length);
                    //Now put them back
                    return [4 /*yield*/, dealRoomController.depositDealAssets(deal1.id, deal1.assetItems)];
                case 4:
                    //Now put them back
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDealMissingAssets(deal1.id)];
                case 5:
                    missingAssets = _a.sent();
                    expect(missingAssets).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Agent: buyer deposit coins", function () { return __awaiter(void 0, void 0, void 0, function () {
        var missingCoins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.depositDealCoins(deal1.id, deal1.price)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDealMissingCoins(deal1.id)];
                case 3:
                    missingCoins = _a.sent();
                    expect(missingCoins).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Agent: buyer withdraw coins before settlement", function () { return __awaiter(void 0, void 0, void 0, function () {
        var missingCoins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.withdrawDealCoins(deal1.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDealMissingCoins(deal1.id)];
                case 3:
                    missingCoins = _a.sent();
                    expect(missingCoins).toEqual(deal1.price);
                    //Now put them back
                    return [4 /*yield*/, dealRoomController.depositDealCoins(deal1.id, deal1.price)];
                case 4:
                    //Now put them back
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDealMissingCoins(deal1.id)];
                case 5:
                    missingCoins = _a.sent();
                    expect(missingCoins).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Agent: seller signature", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.proposeSettleDeal(deal1.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDeal(deal1.id)];
                case 3:
                    deal1 = _a.sent();
                    expect(deal1.agentConfirmations).toEqual(1);
                    expect(deal1.dealConfirmations).toEqual(0);
                    expect(deal1.status).toBe(DealStatus.Open);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Sensor: propose settlement", function () { return __awaiter(void 0, void 0, void 0, function () {
        var transactionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.sensorApprover));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.proposeSettleDeal(deal1.id)];
                case 2:
                    transactionId = _a.sent();
                    return [4 /*yield*/, dealRoomController.getDeal(deal1.id)];
                case 3:
                    deal1 = _a.sent();
                    expect(deal1.dealConfirmations).toEqual(1);
                    expect(deal1.status).toBe(DealStatus.Open);
                    return [2 /*return*/];
            }
        });
    }); }, 10 * MINUTE_MS);
    it("Agent: buyer signature", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.proposeSettleDeal(deal1.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDeal(deal1.id)];
                case 3:
                    deal1 = _a.sent();
                    expect(deal1.agentConfirmations).toEqual(2);
                    expect(deal1.dealConfirmations).toEqual(2);
                    expect(deal1.status).toBe(DealStatus.Open);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Docs: signature settles", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.docApprover));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDeal(deal1.id)];
                case 2:
                    deal1 = _a.sent();
                    console.log(JSON.stringify(deal1, undefined, 4));
                    return [4 /*yield*/, dealRoomController.proposeSettleDeal(deal1.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dealRoomController.getDeal(deal1.id)];
                case 4:
                    deal1 = _a.sent();
                    expect(deal1.agentConfirmations).toEqual(2);
                    expect(deal1.dealConfirmations).toEqual(3);
                    expect(deal1.status).toBe(DealStatus.Settled);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Agent: seller cannot withdraw assets after settlement", function () { return __awaiter(void 0, void 0, void 0, function () {
        var failed, e_1, missingAssets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    failed = false;
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, dealRoomController.withdrawDealAssets(deal1.id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    failed = true;
                    return [3 /*break*/, 5];
                case 5:
                    expect(failed).toBeTruthy();
                    return [4 /*yield*/, dealRoomController.getDealMissingAssets(deal1.id)];
                case 6:
                    missingAssets = _a.sent();
                    expect(missingAssets).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Agent: buyer cannot withdraw coins after settlement", function () { return __awaiter(void 0, void 0, void 0, function () {
        var failed, e_2, missingCoins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    failed = false;
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, dealRoomController.withdrawDealCoins(deal1.id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    failed = true;
                    return [3 /*break*/, 5];
                case 5:
                    expect(failed).toBeTruthy();
                    return [4 /*yield*/, dealRoomController.getDealMissingCoins(deal1.id)];
                case 6:
                    missingCoins = _a.sent();
                    expect(missingCoins).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Agent: seller can withdraw coins after settlement", function () { return __awaiter(void 0, void 0, void 0, function () {
        var failed, e_3, newBalance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    failed = false;
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, dealRoomController.withdrawDealCoins(deal1.id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    failed = true;
                    return [3 /*break*/, 5];
                case 5:
                    expect(failed).toBeFalsy();
                    return [4 /*yield*/, demoEnvironment.deployedEnvironment.erc20.balanceOf(ROOM_1.seller)];
                case 6:
                    newBalance = _a.sent();
                    expect(newBalance.toNumber() - sellerOriginalCoinBalance.toNumber()).toEqual(deal1.price);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Agent: buyer can withdraw assets after settlement", function () { return __awaiter(void 0, void 0, void 0, function () {
        var failed, e_4, newAssetBalance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    failed = false;
                    dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
                    return [4 /*yield*/, dealRoomController.init()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, dealRoomController.withdrawDealAssets(deal1.id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    failed = true;
                    return [3 /*break*/, 5];
                case 5:
                    expect(failed).toBeFalsy();
                    return [4 /*yield*/, demoEnvironment.deployedEnvironment.erc721.balanceOf(ROOM_1.buyer)];
                case 6:
                    newAssetBalance = _a.sent();
                    expect(newAssetBalance.toNumber() - buyerOriginalAssetBalance.toNumber()).toEqual(deal1.assetItems.length);
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
});
