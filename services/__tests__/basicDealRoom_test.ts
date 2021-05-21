
import { JsonRpcProvider } from "ethers/providers"

import { ADMIN, TESTRPC_ACCOUNTS } from "../../lib/settings"
import { getProvider } from "../../services/chain/providerFactory"
import { Deal, DealRoomController, DealStatus } from "../../services/dealRoomController"
import { DealRoomCreateParams } from "../../ethereum/deploy/deploy"
import { DemoEnvironment, setupTest } from "../../lib/testSetup"
import { BigNumber } from "ethers/utils"

let dealRoomController: DealRoomController
let demoEnvironment: DemoEnvironment
let dealRoomHubAddress: string
let provider: JsonRpcProvider
let sellerOriginalCoinBalance: BigNumber
let buyerOriginalAssetBalance: BigNumber

const MINUTE_MS = 60 * 1000

const ROOM_1 = {
    buyer: TESTRPC_ACCOUNTS[5].address,
    seller: TESTRPC_ACCOUNTS[6].address,
    arbitrator: TESTRPC_ACCOUNTS[1].address,
    docApprover: TESTRPC_ACCOUNTS[3].address,
    sensorApprover: TESTRPC_ACCOUNTS[2].address,
}

let deal1: Deal
let roomAddress: string

describe("Deploy basic dealroom", () => {

    beforeAll(async () => {
        //Deploy ERC20 and ERC720, mint some and assign them
        provider = await getProvider()
        demoEnvironment = await setupTest(TESTRPC_ACCOUNTS[1].address, TESTRPC_ACCOUNTS)
        dealRoomHubAddress = demoEnvironment.deployedEnvironment.DealRoomHub.address
        sellerOriginalCoinBalance = await demoEnvironment.deployedEnvironment.erc20.balanceOf(ROOM_1.seller)
        buyerOriginalAssetBalance = await demoEnvironment.deployedEnvironment.erc721.balanceOf(ROOM_1.buyer)
        expect(dealRoomHubAddress).toBeDefined()
        expect(demoEnvironment).toBeDefined()
        expect(demoEnvironment.deployedEnvironment).toBeDefined()
        expect(demoEnvironment.deployedEnvironment.DealRoomHub).toBeDefined()
    }, 1 * MINUTE_MS)

    it("Makes a room", async (): Promise<any> => {

        const dealRoomCreateParams: DealRoomCreateParams = {
            dealRoomHubAddress,
            ...ROOM_1
        }
        roomAddress = await DealRoomController.deployBasicRoom(dealRoomCreateParams, provider.getSigner(ADMIN))
        expect(roomAddress).toBeDefined()
        expect(roomAddress.length).toEqual(42)
    }, 10 * MINUTE_MS)

    it("Makes a deal", async () => {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        expect(dealRoomController).toBeDefined()
        await dealRoomController.init()
        deal1 = {
            erc20: demoEnvironment.deployedEnvironment.erc20.address,
            erc721: demoEnvironment.deployedEnvironment.erc721.address,
            price: new BigNumber(100),
            assetItems: demoEnvironment.erc721Allocations[ROOM_1.seller]
        }
        deal1 = await dealRoomController.makeDeal(deal1)
        deal1 = await dealRoomController.getDeal(deal1.id)

        expect(deal1.dealConfirmations).toEqual(0)
        expect(deal1.status).toBe(DealStatus.Open)
        expect(deal1.id).toBeDefined()
    }, 10 * MINUTE_MS)


    it("Agent: seller deposit assets", async() => {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        await dealRoomController.init()
        await dealRoomController.depositDealAssets(deal1.id, deal1.assetItems)
        const missingAssets = await dealRoomController.getDealMissingAssets(deal1.id)
        expect(missingAssets).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: seller withdraw assets before settlement", async() => {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        await dealRoomController.init()
        await dealRoomController.withdrawDealAssets(deal1.id)
        let missingAssets = await dealRoomController.getDealMissingAssets(deal1.id)
        expect(missingAssets).toEqual(deal1.assetItems.length)

        //Now put them back
        await dealRoomController.depositDealAssets(deal1.id, deal1.assetItems)
        missingAssets = await dealRoomController.getDealMissingAssets(deal1.id)
        expect(missingAssets).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: buyer deposit coins", async() => {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
        await dealRoomController.init()
        await dealRoomController.depositDealCoins(deal1.id, deal1.price)
        const missingCoins = await dealRoomController.getDealMissingCoins(deal1.id)
        expect(missingCoins).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: buyer withdraw coins before settlement", async() => {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
        await dealRoomController.init()
        await dealRoomController.withdrawDealCoins(deal1.id)
        let missingCoins = await dealRoomController.getDealMissingCoins(deal1.id)
        expect(missingCoins).toEqual(deal1.price.toNumber())

        //Now put them back
        await dealRoomController.depositDealCoins(deal1.id, deal1.price)
        missingCoins = await dealRoomController.getDealMissingCoins(deal1.id)
        expect(missingCoins).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: seller signature", async() => {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        await dealRoomController.init()
        await dealRoomController.proposeSettleDeal(deal1.id)
        deal1 = await dealRoomController.getDeal(deal1.id)
        expect(deal1.dealConfirmations).toEqual(1)
        expect(deal1.status).toBe(DealStatus.Open)
    }, 1 * MINUTE_MS)

    it("Agent: buyer signature", async() => {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
        await dealRoomController.init()
        await dealRoomController.proposeSettleDeal(deal1.id)
        deal1 = await dealRoomController.getDeal(deal1.id)
        expect(deal1.dealConfirmations).toEqual(2)
        expect(deal1.status).toBe(DealStatus.Settled)
    }, 1 * MINUTE_MS)


    it("Agent: seller cannot withdraw assets after settlement", async() => {
        let failed = false
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        await dealRoomController.init()
        try {
            await dealRoomController.withdrawDealAssets(deal1.id)
        } catch (e) {
            failed = true
        }
        expect(failed).toBeTruthy()
        let missingAssets = await dealRoomController.getDealMissingAssets(deal1.id)
        expect(missingAssets).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: buyer cannot withdraw coins after settlement", async() => {
        let failed = false
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
        await dealRoomController.init()
        try {
            await dealRoomController.withdrawDealCoins(deal1.id)
        } catch (e) {
            failed = true
        }
        expect(failed).toBeTruthy()
        let missingCoins = await dealRoomController.getDealMissingCoins(deal1.id)
        expect(missingCoins).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: seller can withdraw coins after settlement", async() => {
        let failed = false
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        await dealRoomController.init()
        try {
            await dealRoomController.withdrawDealCoins(deal1.id)
        } catch (e) {
            failed = true
        }
        expect(failed).toBeFalsy()
        const newBalance = await demoEnvironment.deployedEnvironment.erc20.balanceOf(ROOM_1.seller)
        expect(newBalance.toNumber() - sellerOriginalCoinBalance.toNumber()).toEqual(deal1.price.toNumber())
    }, 1 * MINUTE_MS)

    it("Agent: buyer can withdraw assets after settlement", async() => {
        let failed = false
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.buyer))
        await dealRoomController.init()
        try {
            await dealRoomController.withdrawDealAssets(deal1.id)
        } catch (e) {
            failed = true
        }
        expect(failed).toBeFalsy()
        const newAssetBalance = await demoEnvironment.deployedEnvironment.erc721.balanceOf(ROOM_1.buyer)
        expect(newAssetBalance.toNumber() - buyerOriginalAssetBalance.toNumber()).toEqual(deal1.assetItems.length)
    }, 1 * MINUTE_MS)
    
})