//import { JsonRpcProvider } from "ethers/providers"

import { ADMIN, TESTRPC_ACCOUNTS } from "../../lib/settings"
//import { getProvider } from "../../services/chain/providerFactory"
import { Deal, DealController, DealStatus } from "../../services/dealController"
import { DeployDealParams } from "../../ethereum/deploy/deploy"
import { DemoEnvironment, setupTest } from "../../lib/testSetup"
import { BigNumber, ethers } from "ethers"
import { getProvider } from "../../services/chain/providerFactory"
import { DealHub } from "ethereum/types"

// { BigNumber } from "ethers/utils"

const testBuyer = TESTRPC_ACCOUNTS[5].address
const testSeller = TESTRPC_ACCOUNTS[6].address

let dealController: DealController
let demoEnvironment: DemoEnvironment
let dealHubAddress: string
let provider: ethers.providers.JsonRpcProvider
let sellerOriginalCoinBalance: BigNumber
let buyerOriginalAssetBalance: BigNumber

const MINUTE_MS = 60 * 1000

let deal1: Deal
let deal2: Deal
let dealAddress: string
let dealId: string


describe("Deploy basic dealroom", () => {

    beforeAll(async () => {
        console.log("*** Running beforeAll()")
        //Deploy ERC20 and ERC720, mint some and assign them
        provider = getProvider()
        demoEnvironment = await setupTest(TESTRPC_ACCOUNTS[1].address, TESTRPC_ACCOUNTS)
        dealHubAddress = demoEnvironment.deployedEnvironment.DealHub.address
        sellerOriginalCoinBalance = await demoEnvironment.deployedEnvironment.erc20.balanceOf(testSeller)
        buyerOriginalAssetBalance = await demoEnvironment.deployedEnvironment.erc721.balanceOf(testBuyer)
        expect(dealHubAddress).toBeDefined()
        expect(demoEnvironment).toBeDefined()
        expect(demoEnvironment.deployedEnvironment).toBeDefined()
        expect(demoEnvironment.deployedEnvironment.DealHub).toBeDefined()

    }, 1 * MINUTE_MS)

    it("Makes a deal", async (): Promise<any> => {

        const deployDealParams: DeployDealParams = {
            dealHubAddress,
            buyer: testBuyer,
            seller: testSeller,
            erc20: demoEnvironment.deployedEnvironment.erc20.address,
            erc721: demoEnvironment.deployedEnvironment.erc721.address,
            price: 100,
            assetItems: demoEnvironment.erc721Allocations[testSeller]
        }
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
        await dealController.initWithNewDeal(deployDealParams)
        dealAddress = await dealController.getAddress()
        deal1 = await dealController.getDeal()
        expect(deal1).toBeDefined()
        expect(deal1.addr).toBeDefined()
        expect(deal1.addr.length).toEqual(42)
        expect(dealAddress).toBeDefined()
        expect(dealAddress).toEqual(deal1.addr)
    }, 10 * MINUTE_MS)

    it("Loads a deal", async () => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
        await dealController.initWithDeal(dealAddress)

        expect(dealController).toBeDefined()
        deal1 = await dealController.getDeal()
        expect(deal1).toBeDefined()
        expect(deal1.multisigConfirmations).toEqual(0)
        expect(deal1.status).toBe(DealStatus.Open)
        const missingAssets = await dealController.getDealMissingAssets()
        const missingCoins = await dealController.getDealMissingCoins()
        expect(missingAssets).toEqual(deal1.assetItems.length)
        expect(missingCoins).toEqual(BigNumber.from(deal1.price).toNumber())
    }, 10 * MINUTE_MS)

    it("Agent: buyer deposits coins", async() => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
        await dealController.initWithDeal(dealAddress)
        await dealController.depositDealCoins(deal1.price)
        const missingCoins = await dealController.getDealMissingCoins()
        expect(missingCoins).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: seller deposit assets", async() => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testSeller))
        await dealController.initWithDeal(dealAddress)
        await dealController.depositDealAssets(deal1.assetItems)
        const missingAssets = await dealController.getDealMissingAssets()
        expect(missingAssets).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: buyer can withdraw coins before settlement", async() => {
        //@ts-ignore
        let failed = false
        dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
        await dealController.initWithDeal(dealAddress)
        try {
            await dealController.withdrawDealCoins()
        }
        catch (e) {
            failed = true
            console.log(e)
        }
        let missingCoins = await dealController.getDealMissingCoins()
        expect(failed).toBe(false)
        expect(missingCoins).toEqual(BigNumber.from(deal1.price).toNumber())
    }, 1 * MINUTE_MS)

    it("Agent: seller withdraws assets after cancellation", async() => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testSeller))
        await dealController.initWithDeal(dealAddress)
        await dealController.withdrawDealAssets()
        let missingAssets = await dealController.getDealMissingAssets()
        expect(missingAssets).toEqual(deal1.assetItems.length)
    }, 1 * MINUTE_MS)

    it("Makes a deal", async () => {

        const deployDealParams: DeployDealParams = {
            dealHubAddress,
            buyer: testBuyer,
            seller: testSeller,
            erc20: demoEnvironment.deployedEnvironment.erc20.address,
            erc721: demoEnvironment.deployedEnvironment.erc721.address,
            price: BigNumber.from(100),
            assetItems: demoEnvironment.erc721Allocations[testSeller]
        }
        dealController = new DealController(dealHubAddress, provider.getSigner(testSeller))
        await dealController.initWithNewDeal(deployDealParams)
        expect(dealController).toBeDefined()

        deal2 = await dealController.getDeal()
        dealAddress = deal2.addr

        expect(deal2.multisigConfirmations).toEqual(0)
        expect(deal2.status).toBe(DealStatus.Open)
        expect(deal2.addr).toBeDefined()
    }, 10 * MINUTE_MS)

    it("Retrieve my deals", async() => {

        const buyerDeals = await DealController.getUserDeals(demoEnvironment.deployedEnvironment.DealHub.address, provider.getSigner(testBuyer))
        const sellerDeals = await DealController.getUserDeals(demoEnvironment.deployedEnvironment.DealHub.address, provider.getSigner(testSeller))
        expect(buyerDeals.length).toBe(2)
        expect(sellerDeals.length).toBe(2)
    }, 10 * MINUTE_MS)

    it("Agent: seller deposit assets", async() => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testSeller))
        await dealController.initWithDeal(deal2.addr)
        await dealController.depositDealAssets(deal2.assetItems)
        const missingAssets = await dealController.getDealMissingAssets()
        expect(missingAssets).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: seller withdraw assets before settlement", async() => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testSeller))
        await dealController.initWithDeal(deal2.addr)
        await dealController.withdrawDealAssets()
        let missingAssets = await dealController.getDealMissingAssets()
        expect(missingAssets).toEqual(deal2.assetItems.length)

        //Now put them back
        await dealController.depositDealAssets(deal2.assetItems)
        missingAssets = await dealController.getDealMissingAssets()
        expect(missingAssets).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: buyer deposits coins", async() => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
        await dealController.initWithDeal(deal2.addr)
        await dealController.depositDealCoins(deal2.price)
        const missingCoins = await dealController.getDealMissingCoins()
        expect(missingCoins).toEqual(0)
    }, 1 * MINUTE_MS)

    
    it("Agent: seller signature", async() => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testSeller))
        await dealController.initWithDeal(deal2.addr)
        await dealController.proposeSettleDeal()
        deal2 = await dealController.getDeal()

        expect(deal2.multisigConfirmations).toEqual(1)
        expect(deal2.status).toBe(DealStatus.Open)
    }, 1 * MINUTE_MS)

    it("Agent: buyer signature", async() => {
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
        await dealController.initWithDeal(deal2.addr)
        const missingAssets = await dealController.getDealMissingAssets()
        const missingCoins = await dealController.getDealMissingCoins()
        expect(missingAssets).toEqual(0)
        expect(missingCoins).toEqual(0)
        deal2 = await dealController.getDeal() 
        await dealController.proposeSettleDeal()
        deal2 = await dealController.getDeal()
        expect(deal2.multisigConfirmations).toEqual(2)
        expect(deal2.status).toBe(DealStatus.Settled)
    }, 1 * MINUTE_MS)


    it("Agent: seller cannot withdraw assets after settlement", async() => {
        let failed = false
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testSeller))
        await dealController.initWithDeal(deal2.addr)
        try {
            await dealController.withdrawDealAssets()
        } catch (e) {
            failed = true
        }
        expect(failed).toBeTruthy()
        let missingAssets = await dealController.getDealMissingAssets()
        expect(missingAssets).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: buyer cannot withdraw coins after settlement", async() => {
        let failed = false
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
        await dealController.initWithDeal(deal2.addr)
        try {
            await dealController.withdrawDealCoins()
        } catch (e) {
            failed = true
        }
        expect(failed).toBeTruthy()
        let missingCoins = await dealController.getDealMissingCoins()
        expect(missingCoins).toEqual(0)
    }, 1 * MINUTE_MS)

    it("Agent: seller can withdraw coins after settlement", async() => {
        let failed = false
        //@ts-ignore
        dealController = new DealController(dealHubAddress, provider.getSigner(testSeller))
        await dealController.initWithDeal(deal2.addr)
        try {
            await dealController.withdrawDealCoins()
        } catch (e) {
            failed = true
        }
        expect(failed).toBeFalsy()
        const newBalance = await demoEnvironment.deployedEnvironment.erc20.balanceOf(testSeller)
        expect(newBalance.toNumber() - sellerOriginalCoinBalance.toNumber()).toEqual(BigNumber.from(deal2.price).toNumber())
    }, 1 * MINUTE_MS)

    it("Agent: buyer can withdraw assets after settlement", async() => {
        let failed = false

        dealController = new DealController(dealHubAddress, provider.getSigner(testBuyer))
        await dealController.initWithDeal(deal2.addr)
        try {
            await dealController.withdrawDealAssets()
        } catch (e) {
            failed = true
        }
        expect(failed).toBeFalsy()
        const newAssetBalance = await demoEnvironment.deployedEnvironment.erc721.balanceOf(testBuyer)
        expect(newAssetBalance.toNumber() - buyerOriginalAssetBalance.toNumber()).toEqual(deal2.assetItems.length)
    }, 1 * MINUTE_MS) 
})