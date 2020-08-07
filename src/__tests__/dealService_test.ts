import { deployAll, DeployedEnvironment } from "../deploy/deploy";
import { getProvider } from "../services/chain/providerFactory";

// import { DealRoom } from "../types/DealRoom";

import { bnEquals, bnToNumber } from "../util/bigNumbers";
import { MultiSigWallet } from "../types/MultiSigWallet";
import { DealRoomController, DealRoomCreateParams, Deal } from "../services/dealService";
import { getSigner } from "../services/chain/signerFactory";
import { BigNumber, Contract } from "ethers";


type Actor = {
    idx: number;
    assets: number[];
    tokens: number;
    address: string;
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
};

type SimpleDealRoom = {
    seller: Actor;
    buyer: Actor;
    multisig: MultiSigWallet | null;
    arbitrator: Actor;
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
    id: number;
    room: SimpleDealRoom;
    price: number;
    assets: number[];
}

const Deals: { [name: string]: SimpleDeal} = {
    GREEN_1: {
        id: 888888,       
        room: DealRooms.GREEN,
        price: 7,
        assets: DealRooms.GREEN.seller.assets,
    },
    RED_1: {
        id: 444444,
        room: DealRooms.RED,
        price: 10,
        assets: DealRooms.RED.seller.assets,
    },
}
let greenDeal: Deal;

let accounts;
//let dealRoom: DealRoom;
let de: DeployedEnvironment = {};
let roomCount = 0;
const GAS = 6000000;

async function getAccounts() {
    const provider = getProvider()
    return provider.listAccounts()
}

let dealRoomController: DealRoomController
let dealRoomContract: Contract

jest.setTimeout(60000)

describe("Reset", () => {
    beforeAll(async () =>{
        const provider = getProvider();
        accounts = await provider.listAccounts()

        //Deploy all contracts as ADMIN and store references in `de` - DeployedEnvironment
        de = await deployAll()
        expect(de.erc20).toBeDefined()
        expect(de.erc721).toBeDefined()
        if (!de.erc20 || !de.erc721) {
            fail("Not all contracts deployed")
        }

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
    });
 
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
        });   
    });
    describe("Fetching Deal Rooms", () => {
        it("Fetches a room", async () => {
            dealRoomContract = await dealRoomController.getDealRoomContract()
            expect(dealRoomContract instanceof Contract).toBeTruthy()
        });   
    })

    describe("Making deals", () => {
    
        it("Make GREEN deal", async () => {
            if (!de.erc20 || !de.erc721) {
                fail("Not all contracts deployed")
            }
            greenDeal = await dealRoomController.makeDeal({
                id: BigNumber.from(Deals.GREEN_1.id),
                erc20: de.erc20.address,
                erc721: de.erc721.address,
                price: BigNumber.from(Deals.GREEN_1.price),
                assetItems: Deals.GREEN_1.assets.map(item=>BigNumber.from(item)),
            } as Deal)

            const fetchedDeal: Deal = await dealRoomController.getDeal(greenDeal.id)
            expect(fetchedDeal).toEqual(greenDeal)
        });
        /*it("Check GREEN deal status", async () => {
            const missingAssets = await dealRoomController.getDealMissingAssets(Deals.GREEN_1.id)
            const missingTokens = await dealRoomController.getDealMissingTokens(Deals.GREEN_1.id)
            expect(bnEquals(missingAssets, Deals.GREEN_1.assets.length)).toBeTruthy()
            expect(bnEquals(missingTokens, Deals.GREEN_1.price)).toBeTruthy()
        });*/
        it("Deposit tokens", async () => {

            // Get connection to DealRoom for the Buyer's signer
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.buyer.address))

            // Buyer transfers tokens to the Deal Room contract
            await dealRoomController.depositDealTokens(greenDeal.id, greenDeal.price)

            // Now there are no missing tokens
            const missingTokens = await dealRoomController.getDealMissingTokens(Deals.GREEN_1.id)
            expect(bnEquals(missingTokens, 0)).toBeTruthy()
        });
        it("Deposit assets", async () => {
            // Get connection to DealRoom for the Seller's signer
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.seller.address))

            //Seller transfers their tokens to the Deal Room contract
            await dealRoomController.depositDealAssets(greenDeal.id, greenDeal.assetItems)

            const missingAssets = (await dealRoomController.getDealMissingAssets(greenDeal.id))
            expect(bnEquals(missingAssets, 0)).toBeTruthy()
        });
        it("Deal room should have all tokens and assets", async () => {
            if (!de.erc20 || !de.erc721) {
                fail("Not all contracts deployed")
            }
            dealRoomContract = await dealRoomController.getDealRoomContract()
            let tokenBalance = await de.erc20.balanceOf(dealRoomContract.address)
            let assetBalance = await de.erc721.balanceOf(dealRoomContract.address)
            expect(bnEquals(tokenBalance, Deals.GREEN_1.price)).toBeTruthy()
            expect(bnEquals(assetBalance, Deals.GREEN_1.assets.length)).toBeTruthy()
        });
        it("Settle deal", async() => {
            // expect(1).toEqual(1)
            // Seller signs multisig
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.seller.address))
            dealRoomController.approveDeal(greenDeal.id)
            
            // Buyer signs multisig
            dealRoomController = new DealRoomController(await dealRoomController.getAddress(), await getSigner(Deals.GREEN_1.room.buyer.address))
            dealRoomController.approveDeal(greenDeal.id)
            
            // Call settle()
        });
        /*
        it("Claim tokens", async() => {
            if (!de.erc20 || !de.erc721) {
                fail("Not all contracts deployed")
            }

            // Get connection to ERC20 and DealRoom for the Seller's signer
            let sellerErc20: Erc20Detailed = await getErc20Contract(de.erc20.address, Deals.GREEN_1.room.seller.address)

            let oldBalance = await sellerErc20.balanceOf(Deals.GREEN_1.room.seller.address);
            await sellerDealRoom.withdrawDealTokens(Deals.GREEN_1.id)
            let newBalance = await de.erc20.balanceOf(Deals.GREEN_1.room.seller.address);
            expect(bnEquals(newBalance, bnToNumber(oldBalance) + Deals.GREEN_1.price)).toBeTruthy();

        });
        it("Claim assets", async() => {
            if (!de.erc721) {
                fail("Not all contracts deployed")
            }
            // Get connection to ERC721 and DealRoom for the Buyer's signer
            let buyerErc721: Erc721Detailed = await getErc721Contract(de.erc721?.address, Deals.GREEN_1.room.buyer.address)
            let buyerDealRoom: DealRoom = await getDealRoomContract(dealRoom?.address, Deals.GREEN_1.room.buyer.address)
            let oldBalance = await buyerErc721.balanceOf(Deals.GREEN_1.room.buyer.address);
            await buyerDealRoom.withdrawDealAssets(Deals.GREEN_1.id, Deals.GREEN_1.assets.length);     
            let newBalance = await buyerErc721.balanceOf(Deals.GREEN_1.room.buyer.address);
            expect(bnEquals(newBalance, bnToNumber(oldBalance) + Deals.GREEN_1.assets.length)).toBeTruthy();
        });*/
    });
});
