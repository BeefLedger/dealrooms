
//import { JsonRpcProvider } from "ethers/providers"

import { ADMIN, TESTRPC_ACCOUNTS } from "../../lib/settings"
//import { getProvider } from "../../services/chain/providerFactory"
import { Deal, DealRoomController, DealStatus } from "../../services/dealRoomController"
import { DealRoomBasicCreateParams, DealRoomCreateParams } from "../../ethereum/deploy/deploy"
import { DemoEnvironment, setupTest } from "../../lib/testSetup"
import { BigNumber, ethers } from "ethers"
import { getProvider } from "../../services/chain/providerFactory"

// { BigNumber } from "ethers/utils"

let dealRoomController: DealRoomController
let demoEnvironment: DemoEnvironment
let dealRoomHubAddress: string
let provider: ethers.providers.JsonRpcProvider
let sellerOriginalCoinBalance: BigNumber
let buyerOriginalAssetBalance: BigNumber

const MINUTE_MS = 60 * 1000

const ROOM_1 = {
    buyer: TESTRPC_ACCOUNTS[5].address,
    seller: TESTRPC_ACCOUNTS[6].address,
    //arbitrator: TESTRPC_ACCOUNTS[1].address,
    //docApprover: TESTRPC_ACCOUNTS[3].address,
    //sensorApprover: TESTRPC_ACCOUNTS[2].address,
}

let deal1: Deal
let deal2: Deal
let roomAddress: string
let dealId: string

describe("Deploy basic dealroom", () => {

    beforeAll(async () => {
        //Deploy ERC20 and ERC720, mint some and assign them
        provider = getProvider()
        demoEnvironment = await setupTest(TESTRPC_ACCOUNTS[1].address, TESTRPC_ACCOUNTS)
        dealRoomHubAddress = demoEnvironment.deployedEnvironment.DealRoomHub.address
        sellerOriginalCoinBalance = await demoEnvironment.deployedEnvironment.erc20.balanceOf(ROOM_1.seller)
        buyerOriginalAssetBalance = await demoEnvironment.deployedEnvironment.erc721.balanceOf(ROOM_1.buyer)
        expect(dealRoomHubAddress).toBeDefined()
        expect(demoEnvironment).toBeDefined()
        expect(demoEnvironment.deployedEnvironment).toBeDefined()
        expect(demoEnvironment.deployedEnvironment.DealRoomHub).toBeDefined()
    }, 1 * MINUTE_MS)

    /*it("Makes a room", async (): Promise<any> => {

        const dealRoomCreateParams: DealRoomBasicCreateParams = {
            dealRoomHubAddress,
            ...ROOM_1
        }
        //@ts-ignore
        roomAddress = await DealRoomController.deployBasicRoom(dealRoomCreateParams, provider.getSigner(ADMIN))
        expect(roomAddress).toBeDefined()
        expect(roomAddress.length).toEqual(42)
    }, 10 * MINUTE_MS)

*/

    it("Makes a room and deal in a single transaction", async () => {
        const dealRoomCreateParams: DealRoomBasicCreateParams = {
            dealRoomHubAddress,
            ...ROOM_1
        }
        deal1 = {
            erc20: demoEnvironment.deployedEnvironment.erc20.address,
            erc721: demoEnvironment.deployedEnvironment.erc721.address,
            price: BigNumber.from(100),
            assetItems: demoEnvironment.erc721Allocations[ROOM_1.seller]
        }
        //@ts-ignore
        const result = (await DealRoomController.deployRoomAndDeal(dealRoomCreateParams, deal1, provider.getSigner(ROOM_1.buyer)))
        roomAddress = result.roomAddress
        deal1.id = result.dealId 

        //@ts-ignore
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        expect(dealRoomController).toBeDefined()
        await dealRoomController.init()

        deal1 = await dealRoomController.getDeal(deal1.id)

        expect(roomAddress).toBeDefined()
        expect(roomAddress.length).toEqual(42)  

        expect(deal1.dealConfirmations).toEqual(0)
        expect(deal1.status).toBe(DealStatus.Open)
        expect(deal1.id).toBeDefined()
    })

    it("Gets a deal", async () => {
        //@ts-ignore
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        expect(dealRoomController).toBeDefined()
        await dealRoomController.init()
        deal1 = await dealRoomController.getDeal(deal1.id)
        expect(deal1).toBeDefined()
        expect(deal1.dealConfirmations).toEqual(0)
        expect(deal1.status).toBe(DealStatus.Open)
        expect(deal1.id).toBeDefined()
        const missingAssets = await dealRoomController.getDealMissingAssets(deal1.id)
        const missingCoins = await dealRoomController.getDealMissingCoins(deal1.id)
        expect(missingAssets).toEqual(deal1.assetItems.length)
        expect(missingCoins).toEqual(BigNumber.from(deal1.price).toNumber())
    }, 10 * MINUTE_MS)

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

    
})