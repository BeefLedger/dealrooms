export const hello = "hello"

/*import { deployAll, DeployedEnvironment } from "../../ethereum/deploy/deploy"
import { getProvider } from "../chain/providerFactory"

import { bnEquals, bnToNumber } from "../../lib/bigNumbers"
import { MultiSigWallet } from "../../ethereum/types/MultiSigWallet"
import { DealRoom } from "../../ethereum/types/DealRoom"
import { DealRoomController, DealRoomCreateParams, Deal } from "../dealRoomController"
import { getSigner } from "../chain/signerFactory"
import { Contract } from "ethers"
import { BigNumber, bigNumberify } from "ethers/utils"
// import { Erc20Detailed } from "../../ethereum/types/Erc20Detailed"

type Actor = {
    idx: number
    assets: number[]    cd ....
    tokens: number
    address: string
}
const Actors: { [name: string]: Actor } = {
    ADMIN: {
        idx: 0,
        assets: [],
        tokens: 0,
        address: "",
    },
    ALICE: {
        idx: 1,
        assets: [111,222,333,444],
        tokens: 100,
        address: "",
    },
    BOB: {
        idx: 2,
        assets: [555,666,777,888],
        tokens: 100,
        address: "",
    },
    CHARLIE: {
        idx: 3,
        assets: [],
        tokens: 100,
        address: "",
    },    
    DANI: {
        idx: 4,
        assets: [],
        tokens: 100,
        address: "",
    },    
    EDWARD:  {
        idx: 5,
        assets: [],
        tokens: 100,
        address: "",
    },
}

type SimpleDealRoom = {
    seller: Actor
    buyer: Actor
    multisig: MultiSigWallet | null
    arbitrator: Actor
}

const DealRooms: { [name: string]: SimpleDealRoom } = {
    GREEN: {
        seller: Actors.ALICE,
        buyer: Actors.EDWARD,
        arbitrator: Actors.DANI,
        multisig: null,
    },
    RED: {
        seller: Actors.BOB,
        buyer: Actors.EDWARD,
        arbitrator: Actors.DANI,
        multisig: null,
    },
}

type SimpleDeal = {
    id: number
    room: SimpleDealRoom
    price: number
    assets: number[]
}

const Deals: { [name: string]: SimpleDeal} = {
    GREEN_1: {
        id: 0,       
        room: DealRooms.GREEN,
        price: 7,
        assets: DealRooms.GREEN.seller.assets,
    },
    RED_1: {
        id: 1,
        room: DealRooms.RED,
        price: 10,
        assets: DealRooms.RED.seller.assets,
    },
}

let accounts
//let dealRoom: DealRoom
let de: DeployedEnvironment = {}
let roomCount = 0
const GAS = 6000000

async function getAccounts() {
    const provider = getProvider()
    return provider.listAccounts()
}

let dealRoomController: DealRoomController
let dealRoomContract: DealRoom

jest.setTimeout(60000)

describe("Reset", () => {
    beforeAll(async () =>{
        const provider = getProvider()
        accounts = await provider.listAccounts()

        //Deploy all contracts as ADMIN and store references in `de` - DeployedEnvironment
        de = await deployAll(provider.getSigner())
        expect(de.erc20).toBeDefined()
        expect(de.erc721).toBeDefined()
        if (!de.erc20 || !de.erc721) {
            fail("Not all contracts deployed")
        }
       // console.log(`Environment: ${JSON.stringify(de, undefined, 4)}`)

        for (let actorId in Actors) {
            let actor = Actors[actorId]
            actor.address = accounts[actor.idx]
            await de.erc20.mint(actor.address, actor.tokens)
            for (let asset of actor.assets) {
                await de.erc721.mint(actor.address, asset)
            }
            const balance = bnToNumber(await de.erc20.balanceOf(actor.address))
            const assetCount = bnToNumber(await de.erc721.balanceOf(actor.address))
            expect(balance).toEqual(actor.tokens)
            expect(actor.assets.length).toEqual(assetCount)
        }
        expect(de.erc20.address).toBeDefined()
        expect(de.erc721.address).toBeDefined()
        expect(accounts.length).toBeGreaterThanOrEqual(6)
    })
 
    describe("Making Deal Rooms", () => {
        
        it("Makes a room", async () => {
            //The seller creates a room
            dealRoomController = new DealRoomController({
                buyer: DealRooms.GREEN.buyer.address,
                seller: DealRooms.GREEN.seller.address,
                arbitrator: DealRooms.GREEN.arbitrator.address,

            } as DealRoomCreateParams,
                await getSigner(DealRooms.GREEN.seller.idx)
            )
        })  
    })
    describe("Fetching Deal Rooms", () => {
        it("Fetches a room", async () => {
            dealRoomContract = await dealRoomController.getDealRoomContract()
            expect(dealRoomContract instanceof Contract).toBeTruthy()
        })  
    })

    describe("Making deals", () => {
    
        it("Make GREEN deal", async () => {
            if (!de.erc20 || !de.erc721) {
                fail("Not all contracts deployed")
            }
            
            const greenDeal = await dealRoomController.makeDeal({
                //id: bigNumberify(Deals.GREEN_1.id),
                erc20: de.erc20.address,
                erc721: de.erc721.address,
                price: bigNumberify(Deals.GREEN_1.price),
                assetItems: Deals.GREEN_1.assets.map(item=>bigNumberify(item)),
            } as Deal)

            const fetchedDeal: Deal = await dealRoomController.getDeal(greenDeal.id)
            expect(fetchedDeal).toEqual(greenDeal)
        })
        it("Check GREEN deal status", async () => {
            const missingAssets = await dealRoomController.getDealMissingAssets(Deals.GREEN_1.id)
            const missingTokens = await dealRoomController.getDealMissingTokens(Deals.GREEN_1.id)
            expect(bnEquals(missingAssets, Deals.GREEN_1.assets.length)).toBeTruthy()
            expect(bnEquals(missingTokens, Deals.GREEN_1.price)).toBeTruthy()
        })
        it("Deposit tokens", async () => {

            // Get connection to DealRoom for the Buyer's signer
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.buyer.address))

            // Buyer transfers tokens to the Deal Room contract
            await dealRoomController.depositDealTokens(Deals.GREEN_1.id, Deals.GREEN_1.price)

            // Now there are no missing tokens
            const missingTokens = await dealRoomController.getDealMissingTokens(Deals.GREEN_1.id)
            expect(bnEquals(missingTokens, 0)).toBeTruthy()
        })
        it("Deposit assets", async () => {
            // Get connection to DealRoom for the Seller's signer
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.seller.address))

            //Seller transfers their tokens to the Deal Room contract
            await dealRoomController.depositDealAssets(Deals.GREEN_1.id, Deals.GREEN_1.assets)

            const missingAssets = (await dealRoomController.getDealMissingAssets(Deals.GREEN_1.id))
            expect(bnEquals(missingAssets, 0)).toBeTruthy()
        })
        it("Deal room should have all tokens and assets", async () => {
            if (!de.erc20 || !de.erc721) {
                fail("Not all contracts deployed")
            }
            dealRoomContract = await dealRoomController.getDealRoomContract()
            let tokenBalance = await de.erc20.balanceOf(dealRoomContract.address)
            let assetBalance = await de.erc721.balanceOf(dealRoomContract.address)
            expect(bnEquals(tokenBalance, Deals.GREEN_1.price)).toBeTruthy()
            expect(bnEquals(assetBalance, Deals.GREEN_1.assets.length)).toBeTruthy()
        })
        it("Deal is ready", async() => {
            const deal = await dealRoomController.getDeal(Deals.GREEN_1.id)
            // console.log(JSON.stringify(deal, undefined, 4))
            const missingAssets = (await dealRoomController.getDealMissingAssets(Deals.GREEN_1.id))
            expect(bnEquals(missingAssets, 0)).toBeTruthy()
            const missingTokens = await dealRoomController.getDealMissingTokens(Deals.GREEN_1.id)
            expect(bnEquals(missingTokens, 0)).toBeTruthy()
        })
        it("Settle deal", async() => {
            // Seller signs multisig
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.seller.address))
            const transactionId = await dealRoomController.proposeSettleDeal(Deals.GREEN_1.id)
            
            // Buyer signs multisig
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.buyer.address))
            const approvalResult = await dealRoomController.approveSettlementProposal(transactionId)
            //console.log("Approval result", JSON.stringify(approvalResult, undefined, 4))

            const deal = await dealRoomController.getDeal(Deals.GREEN_1.id)
            expect(deal.status).toEqual(3)
            
            //expect(result).toBeDefined()
        })
        
        it("Claim tokens", async() => {
            if (!de.erc20) {
                fail("Not all contracts deployed")
            }
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.seller.address))

            let oldBalance = await de.erc20.balanceOf(Deals.GREEN_1.room.seller.address)
            await dealRoomController.withdrawDealTokens(Deals.GREEN_1.id)
            let newBalance = await de.erc20.balanceOf(Deals.GREEN_1.room.seller.address)
            expect(bnEquals(newBalance, bnToNumber(oldBalance) + Deals.GREEN_1.price)).toBeTruthy()

        })
        it("Claim assets", async() => {
            if (!de.erc721) {
                fail("Not all contracts deployed")
            }

            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.buyer.address))

            let oldBalance = await de.erc721.balanceOf(Deals.GREEN_1.room.buyer.address)
            await dealRoomController.withdrawDealAssets(Deals.GREEN_1.id)     
            let newBalance = await de.erc721.balanceOf(Deals.GREEN_1.room.buyer.address)
            expect(bnEquals(newBalance, bnToNumber(oldBalance) + Deals.GREEN_1.assets.length)).toBeTruthy()
        })
    })
})
*/