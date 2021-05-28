var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as ethers from "ethers";
import { ADMIN, TESTRPC_ACCOUNTS } from "../../lib/settings";
import { getProvider } from "../../services/chain/providerFactory";
import { DealRoomController, DealStatus } from "../../services/dealRoomController";
import { setupTest } from "../../lib/testSetup";
let dealRoomController;
let demoEnvironment;
let dealRoomHubAddress;
let provider;
let sellerOriginalCoinBalance;
let buyerOriginalAssetBalance;
const MINUTE_MS = 60 * 1000;
const ROOM_1 = {
    buyer: TESTRPC_ACCOUNTS[5].address,
    seller: TESTRPC_ACCOUNTS[6].address,
    arbitrator: TESTRPC_ACCOUNTS[1].address,
    docApprover: TESTRPC_ACCOUNTS[3].address,
    sensorApprover: TESTRPC_ACCOUNTS[2].address,
};
let deal1;
let roomAddress;
describe("Deploy dealroom", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //Deploy ERC20 and ERC720, mint some and assign them
        provider = yield getProvider();
        demoEnvironment = yield setupTest(TESTRPC_ACCOUNTS[1].address, TESTRPC_ACCOUNTS);
        dealRoomHubAddress = demoEnvironment.deployedEnvironment.DealRoomHub.address;
        sellerOriginalCoinBalance = yield demoEnvironment.deployedEnvironment.erc20.balanceOf(ROOM_1.seller);
        buyerOriginalAssetBalance = yield demoEnvironment.deployedEnvironment.erc721.balanceOf(ROOM_1.buyer);
        expect(dealRoomHubAddress).toBeDefined();
        expect(demoEnvironment).toBeDefined();
        expect(demoEnvironment.deployedEnvironment).toBeDefined();
        expect(demoEnvironment.deployedEnvironment.DealRoomHub).toBeDefined();
    }), 1 * MINUTE_MS);
    it("Makes a room", () => __awaiter(void 0, void 0, void 0, function* () {
        const dealRoomCreateParams = Object.assign({ dealRoomHubAddress }, ROOM_1);
        roomAddress = yield DealRoomController.deployRoom(dealRoomCreateParams, provider.getSigner(ADMIN));
        expect(roomAddress).toBeDefined();
        expect(roomAddress.length).toEqual(42);
    }), 1 * MINUTE_MS);
    it("Makes a deal", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
        expect(dealRoomController).toBeDefined();
        yield dealRoomController.init();
        deal1 = {
            erc20: demoEnvironment.deployedEnvironment.erc20.address,
            erc721: demoEnvironment.deployedEnvironment.erc721.address,
            price: ethers.BigNumber.from(100),
            assetItems: demoEnvironment.erc721Allocations[ROOM_1.seller]
        };
        deal1 = yield dealRoomController.makeDeal(deal1);
        deal1 = yield dealRoomController.getDeal(deal1.id);
        expect(deal1.agentConfirmations).toEqual(0);
        expect(deal1.dealConfirmations).toEqual(0);
        expect(deal1.status).toBe(DealStatus.Open);
        expect(deal1.id).toBeDefined();
    }), 10 * MINUTE_MS);
    it("Sensor: propose dummy settlement without effect", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.sensorApprover));
        yield dealRoomController.init();
        yield dealRoomController.proposeSettleDeal(ethers.BigNumber.from(1000)),
            deal1 = yield dealRoomController.getDeal(deal1.id);
        const ms = yield dealRoomController._getDealMultiSig();
        const transactions = yield ms.getTransactions();
        expect(deal1.dealConfirmations).toEqual(0);
        expect(deal1.status).toBe(DealStatus.Open);
    }), 10 * MINUTE_MS);
    it("Agent: seller deposit assets", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
        yield dealRoomController.init();
        yield dealRoomController.depositDealAssets(deal1.id, deal1.assetItems);
        const missingAssets = yield dealRoomController.getDealMissingAssets(deal1.id);
        expect(missingAssets).toEqual(0);
    }), 1 * MINUTE_MS);
    it("Agent: seller withdraw assets before settlement", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
        yield dealRoomController.init();
        yield dealRoomController.withdrawDealAssets(deal1.id);
        let missingAssets = yield dealRoomController.getDealMissingAssets(deal1.id);
        expect(missingAssets).toEqual(deal1.assetItems.length);
        //Now put them back
        yield dealRoomController.depositDealAssets(deal1.id, deal1.assetItems);
        missingAssets = yield dealRoomController.getDealMissingAssets(deal1.id);
        expect(missingAssets).toEqual(0);
    }), 1 * MINUTE_MS);
    it("Agent: buyer deposit coins", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
        yield dealRoomController.init();
        yield dealRoomController.depositDealCoins(deal1.id, deal1.price);
        const missingCoins = yield dealRoomController.getDealMissingCoins(deal1.id);
        expect(missingCoins).toEqual(0);
    }), 1 * MINUTE_MS);
    it("Agent: buyer withdraw coins before settlement", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
        yield dealRoomController.init();
        yield dealRoomController.withdrawDealCoins(deal1.id);
        let missingCoins = yield dealRoomController.getDealMissingCoins(deal1.id);
        expect(missingCoins).toEqual(deal1.price.toNumber());
        //Now put them back
        yield dealRoomController.depositDealCoins(deal1.id, deal1.price);
        missingCoins = yield dealRoomController.getDealMissingCoins(deal1.id);
        expect(missingCoins).toEqual(0);
    }), 1 * MINUTE_MS);
    it("Agent: seller signature", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
        yield dealRoomController.init();
        yield dealRoomController.proposeSettleDeal(deal1.id);
        deal1 = yield dealRoomController.getDeal(deal1.id);
        expect(deal1.agentConfirmations).toEqual(1);
        expect(deal1.dealConfirmations).toEqual(0);
        expect(deal1.status).toBe(DealStatus.Open);
    }), 1 * MINUTE_MS);
    it("Sensor: propose settlement", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.sensorApprover));
        yield dealRoomController.init();
        const transactionId = yield dealRoomController.proposeSettleDeal(deal1.id);
        deal1 = yield dealRoomController.getDeal(deal1.id);
        expect(deal1.dealConfirmations).toEqual(1);
        expect(deal1.status).toBe(DealStatus.Open);
    }), 10 * MINUTE_MS);
    it("Agent: buyer signature", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
        yield dealRoomController.init();
        yield dealRoomController.proposeSettleDeal(deal1.id);
        deal1 = yield dealRoomController.getDeal(deal1.id);
        expect(deal1.agentConfirmations).toEqual(2);
        expect(deal1.dealConfirmations).toEqual(2);
        expect(deal1.status).toBe(DealStatus.Open);
    }), 1 * MINUTE_MS);
    it("Docs: signature settles", () => __awaiter(void 0, void 0, void 0, function* () {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.docApprover));
        yield dealRoomController.init();
        deal1 = yield dealRoomController.getDeal(deal1.id);
        console.log(JSON.stringify(deal1, undefined, 4));
        yield dealRoomController.proposeSettleDeal(deal1.id);
        deal1 = yield dealRoomController.getDeal(deal1.id);
        expect(deal1.agentConfirmations).toEqual(2);
        expect(deal1.dealConfirmations).toEqual(3);
        expect(deal1.status).toBe(DealStatus.Settled);
    }), 1 * MINUTE_MS);
    it("Agent: seller cannot withdraw assets after settlement", () => __awaiter(void 0, void 0, void 0, function* () {
        let failed = false;
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
        yield dealRoomController.init();
        try {
            yield dealRoomController.withdrawDealAssets(deal1.id);
        }
        catch (e) {
            failed = true;
        }
        expect(failed).toBeTruthy();
        let missingAssets = yield dealRoomController.getDealMissingAssets(deal1.id);
        expect(missingAssets).toEqual(0);
    }), 1 * MINUTE_MS);
    it("Agent: buyer cannot withdraw coins after settlement", () => __awaiter(void 0, void 0, void 0, function* () {
        let failed = false;
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
        yield dealRoomController.init();
        try {
            yield dealRoomController.withdrawDealCoins(deal1.id);
        }
        catch (e) {
            failed = true;
        }
        expect(failed).toBeTruthy();
        let missingCoins = yield dealRoomController.getDealMissingCoins(deal1.id);
        expect(missingCoins).toEqual(0);
    }), 1 * MINUTE_MS);
    it("Agent: seller can withdraw coins after settlement", () => __awaiter(void 0, void 0, void 0, function* () {
        let failed = false;
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller));
        yield dealRoomController.init();
        try {
            yield dealRoomController.withdrawDealCoins(deal1.id);
        }
        catch (e) {
            failed = true;
        }
        expect(failed).toBeFalsy();
        const newBalance = yield demoEnvironment.deployedEnvironment.erc20.balanceOf(ROOM_1.seller);
        expect(newBalance.toNumber() - sellerOriginalCoinBalance.toNumber()).toEqual(deal1.price.toNumber());
    }), 1 * MINUTE_MS);
    it("Agent: buyer can withdraw assets after settlement", () => __awaiter(void 0, void 0, void 0, function* () {
        let failed = false;
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer));
        yield dealRoomController.init();
        try {
            yield dealRoomController.withdrawDealAssets(deal1.id);
        }
        catch (e) {
            failed = true;
        }
        expect(failed).toBeFalsy();
        const newAssetBalance = yield demoEnvironment.deployedEnvironment.erc721.balanceOf(ROOM_1.buyer);
        expect(newAssetBalance.toNumber() - buyerOriginalAssetBalance.toNumber()).toEqual(deal1.assetItems.length);
    }), 1 * MINUTE_MS);
});
