//import { JsonRpcProvider } from "ethers/providers"
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
import { TESTRPC_ACCOUNTS } from "../../lib/settings";
//import { getProvider } from "../../services/chain/providerFactory"
import { DealController } from "../../services/dealController";
import { setupTest } from "../../lib/testSetup";
import { getProvider } from "../../services/chain/providerFactory";
// { BigNumber } from "ethers/utils"
var testBuyer = TESTRPC_ACCOUNTS[5].address;
var testSeller = TESTRPC_ACCOUNTS[6].address;
var dealController;
var demoEnvironment;
var dealHubAddress;
var provider;
var sellerOriginalCoinBalance;
var buyerOriginalAssetBalance;
var MINUTE_MS = 60 * 1000;
var deal1;
var deal2;
var dealAddress;
var dealId;
describe("Deploy basic dealroom", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //Deploy ERC20 and ERC720, mint some and assign them
                    provider = getProvider();
                    return [4 /*yield*/, setupTest(TESTRPC_ACCOUNTS[1].address, TESTRPC_ACCOUNTS)];
                case 1:
                    demoEnvironment = _a.sent();
                    dealHubAddress = demoEnvironment.deployedEnvironment.DealHub.address;
                    return [4 /*yield*/, demoEnvironment.deployedEnvironment.erc20.balanceOf(testSeller)];
                case 2:
                    sellerOriginalCoinBalance = _a.sent();
                    return [4 /*yield*/, demoEnvironment.deployedEnvironment.erc721.balanceOf(testBuyer)];
                case 3:
                    buyerOriginalAssetBalance = _a.sent();
                    expect(dealHubAddress).toBeDefined();
                    expect(demoEnvironment).toBeDefined();
                    expect(demoEnvironment.deployedEnvironment).toBeDefined();
                    expect(demoEnvironment.deployedEnvironment.DealHub).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); }, 1 * MINUTE_MS);
    it("Makes a deal", function () { return __awaiter(void 0, void 0, void 0, function () {
        var deployDealParams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deployDealParams = {
                        dealHubAddress: dealHubAddress,
                        buyer: testBuyer,
                        seller: testSeller,
                        erc20: demoEnvironment.deployedEnvironment.erc20.address,
                        erc721: demoEnvironment.deployedEnvironment.erc721.address,
                        price: 100,
                        assetItems: demoEnvironment.erc721Allocations[testSeller]
                    };
                    //@ts-ignore
                    dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer));
                    return [4 /*yield*/, dealController.initWithNewDeal(deployDealParams)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dealController.getAddress()];
                case 2:
                    dealAddress = _a.sent();
                    return [4 /*yield*/, dealController.getDeal()];
                case 3:
                    deal1 = _a.sent();
                    expect(deal1).toBeDefined();
                    expect(deal1.addr).toBeDefined();
                    expect(deal1.addr.length).toEqual(42);
                    expect(dealAddress).toBeDefined();
                    expect(dealAddress).toEqual(deal1.addr);
                    return [2 /*return*/];
            }
        });
    }); }, 10 * MINUTE_MS);
    /* it("Loads a deal", async () => {
         //@ts-ignore
         dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
         dealController.initWithDeal(dealAddress)
 
         expect(dealController).toBeDefined()
         deal1 = await dealController.deal
         expect(deal1).toBeDefined()
         expect(deal1.multisigConfirmations).toEqual(0)
         expect(deal1.status).toBe(DealStatus.Open)
         const missingAssets = await dealController.getDealMissingAssets()
         const missingCoins = await dealController.getDealMissingCoins()
         expect(missingAssets).toEqual(deal1.assetItems.length)
         expect(missingCoins).toEqual(BigNumber.from(deal1.price).toNumber())
     }, 10 * MINUTE_MS)*/
    /*
        it("Agent: buyer deposits coins", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
            await dealRoomController.init()
            await dealRoomController.depositDealCoins(deal1.id, deal1.price)
            const missingCoins = await dealRoomController.getDealMissingCoins(deal1.id)
            expect(missingCoins).toEqual(0)
        }, 1 * MINUTE_MS)
    
        it("Agent: seller deposit assets", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
            await dealRoomController.init()
            await dealRoomController.depositDealAssets(deal1.id, deal1.assetItems)
            const missingAssets = await dealRoomController.getDealMissingAssets(deal1.id)
            expect(missingAssets).toEqual(0)
        }, 1 * MINUTE_MS)
    
        it("Agent: buyer can't withdraw coins before settlement", async() => {
            //@ts-ignore
            let failed = false
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
            await dealRoomController.init()
            try {
                await dealRoomController.withdrawDealCoins(deal1.id)
            }
            catch (e) {
                failed = true
            }
            let missingCoins = await dealRoomController.getDealMissingCoins(deal1.id)
            expect(missingCoins).toEqual(0)
            expect(failed).toBe(true)
            //expect(missingCoins).toEqual(BigNumber.from(deal1.price).toNumber())
        }, 1 * MINUTE_MS)
    
        it("Agent: buyer cancels deal before settlement", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
            await dealRoomController.init()
            await dealRoomController.cancelDeal(deal1.id)
            let missingCoins = await dealRoomController.getDealMissingCoins(deal1.id)
            expect(missingCoins).toEqual(BigNumber.from(deal1.price).toNumber())
        }, 1 * MINUTE_MS)
    
        it("Agent: seller withdraws assets after cancellation", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
            await dealRoomController.init()
            await dealRoomController.withdrawDealAssets(deal1.id)
            let missingAssets = await dealRoomController.getDealMissingAssets(deal1.id)
            expect(missingAssets).toEqual(deal1.assetItems.length)
        }, 1 * MINUTE_MS)
    
        it("Makes a deal", async () => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
            expect(dealRoomController).toBeDefined()
            await dealRoomController.init()
            deal2 = {
                erc20: demoEnvironment.deployedEnvironment.erc20.address,
                erc721: demoEnvironment.deployedEnvironment.erc721.address,
                price: BigNumber.from(100),
                assetItems: demoEnvironment.erc721Allocations[ROOM_1.seller]
            }
            deal2 = await dealRoomController.makeDeal(deal2)
            deal2 = await dealRoomController.getDeal(deal2.id)
    
            expect(deal2.dealConfirmations).toEqual(0)
            expect(deal2.status).toBe(DealStatus.Open)
            expect(deal2.id).toBeDefined()
        }, 10 * MINUTE_MS)
    
        it("Agent: seller deposit assets", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
            await dealRoomController.init()
            await dealRoomController.depositDealAssets(deal2.id, deal2.assetItems)
            const missingAssets = await dealRoomController.getDealMissingAssets(deal2.id)
            expect(missingAssets).toEqual(0)
        }, 1 * MINUTE_MS)
    
        it("Agent: seller withdraw assets before settlement", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
            await dealRoomController.init()
            await dealRoomController.withdrawDealAssets(deal2.id)
            let missingAssets = await dealRoomController.getDealMissingAssets(deal2.id)
            expect(missingAssets).toEqual(deal2.assetItems.length)
    
            //Now put them back
            await dealRoomController.depositDealAssets(deal2.id, deal2.assetItems)
            missingAssets = await dealRoomController.getDealMissingAssets(deal2.id)
            expect(missingAssets).toEqual(0)
        }, 1 * MINUTE_MS)
    
        it("Agent: buyer deposits coins", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
            await dealRoomController.init()
            await dealRoomController.depositDealCoins(deal2.id, deal2.price)
            const missingCoins = await dealRoomController.getDealMissingCoins(deal2.id)
            expect(missingCoins).toEqual(0)
        }, 1 * MINUTE_MS)
    
        it("Agent: seller signature", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
            await dealRoomController.init()
            await dealRoomController.proposeSettleDeal(deal2.id)
            deal2 = await dealRoomController.getDeal(deal2.id)
            expect(deal2.dealConfirmations).toEqual(1)
            expect(deal2.status).toBe(DealStatus.Open)
        }, 1 * MINUTE_MS)
    
        it("Agent: buyer signature", async() => {
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
            await dealRoomController.init()
            const missingAssets = await dealRoomController.getDealMissingAssets(deal2.id)
            const missingCoins = await dealRoomController.getDealMissingCoins(deal2.id)
            expect(missingAssets).toEqual(0)
            expect(missingCoins).toEqual(0)
            
            await dealRoomController.proposeSettleDeal(deal2.id)
            deal2 = await dealRoomController.getDeal(deal2.id)
            expect(deal2.dealConfirmations).toEqual(2)
            expect(deal2.status).toBe(DealStatus.Settled)
        }, 1 * MINUTE_MS)
    
    
        it("Agent: seller cannot withdraw assets after settlement", async() => {
            let failed = false
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
            await dealRoomController.init()
            try {
                await dealRoomController.withdrawDealAssets(deal2.id)
            } catch (e) {
                failed = true
            }
            expect(failed).toBeTruthy()
            let missingAssets = await dealRoomController.getDealMissingAssets(deal2.id)
            expect(missingAssets).toEqual(0)
        }, 1 * MINUTE_MS)
    
        it("Agent: buyer cannot withdraw coins after settlement", async() => {
            let failed = false
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
            await dealRoomController.init()
            try {
                await dealRoomController.withdrawDealCoins(deal2.id)
            } catch (e) {
                failed = true
            }
            expect(failed).toBeTruthy()
            let missingCoins = await dealRoomController.getDealMissingCoins(deal2.id)
            expect(missingCoins).toEqual(0)
        }, 1 * MINUTE_MS)
    
        it("Agent: seller can withdraw coins after settlement", async() => {
            let failed = false
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
            await dealRoomController.init()
            try {
                await dealRoomController.withdrawDealCoins(deal2.id)
            } catch (e) {
                failed = true
            }
            expect(failed).toBeFalsy()
            const newBalance = await demoEnvironment.deployedEnvironment.erc20.balanceOf(ROOM_1.seller)
            expect(newBalance.toNumber() - sellerOriginalCoinBalance.toNumber()).toEqual(BigNumber.from(deal2.price).toNumber())
        }, 1 * MINUTE_MS)
    
        it("Agent: buyer can withdraw assets after settlement", async() => {
            let failed = false
            //@ts-ignore
            dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
            await dealRoomController.init()
            try {
                await dealRoomController.withdrawDealAssets(deal2.id)
            } catch (e) {
                failed = true
            }
            expect(failed).toBeFalsy()
            const newAssetBalance = await demoEnvironment.deployedEnvironment.erc721.balanceOf(ROOM_1.buyer)
            expect(newAssetBalance.toNumber() - buyerOriginalAssetBalance.toNumber()).toEqual(deal2.assetItems.length)
        }, 1 * MINUTE_MS)
    */
});
