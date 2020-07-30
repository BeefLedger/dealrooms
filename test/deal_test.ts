//const Web3 = require('web3');
//web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//const ERC721Detailed = artifacts.require("ERC721Detailed.sol");
//const ERC20Detailed = artifacts.require("ERC20Detailed.sol");
//const DealRoomDeployer = artifacts.require("DealRoomDeployer.sol");
//const DealRoom = artifacts.require("DealRoom.sol");
import { DealRoom } from "../build/types/DealRoom"
import { deployContract, getContract } from "../services/chain/contractFactory";
import { deployAll, DeployedEnvironment } from "../deploy/deploy";
import { isAssertionExpression } from "typescript";
import { getProvider } from "../services/chain/providerFactory";
import * as artifactDealRoom from "../build/contracts/DealRoom.json";
import { DealRoomDeployer } from "../build/types/DealRoomDeployer";
import { Erc20Detailed } from "../build/types/Erc20Detailed";
import { Erc721Detailed } from "../build/types/Erc721Detailed";
import { getDealRoomContract, getErc721Contract, getErc20Contract } from "../services/chain/prefabContractFactory";

const buyerIdx = 2;
const sellerIdx = 3;
type Actor = {
    idx: number;
    assets: number[];
    tokens: number;
    address: string;
}
const Actors: { [name: string]: Actor } = {
    ALICE: {
        idx: 0,
        assets: [111,222,333,444],
        tokens: 100,
        address: "",
    },
    BOB: {
        idx: 1,
        assets: [555,666,777,888],
        tokens: 100,
        address: "",
    },
    CHARLIE: {
        idx: 2,
        assets: [],
        tokens: 100,
        address: "",
    },    
    DANI: {
        idx: 3,
        assets: [],
        tokens: 100,
        address: "",
    },    
    EDWARD:  {
        idx: 4,
        assets: [],
        tokens: 100,
        address: "",
    },
};

type DealRoomType = {
    id: number;
    seller: Actor;
    buyer: Actor;
}

const DealRooms: { [name: string]: DealRoomType } = {
    GREEN: {
        id: 777,
        seller: Actors.ALICE,
        buyer: Actors.EDWARD,      
    },
    RED: {
        id: 222,
        seller: Actors.BOB,
        buyer: Actors.EDWARD,      
    },
}

type Deal = {
    id: number;
    arbitrator: Actor;
    room: DealRoomType;
    price: number;
    assets: number[];
}

const Deals: { [name: string]: Deal} = {
    GREEN_1: {
        id: 888888,
        arbitrator: Actors.DANI,
        room: DealRooms.GREEN,
        price: 7,
        assets: DealRooms.GREEN.seller.assets,
    },
    RED_1: {
        id: 444444,
        arbitrator: Actors.DANI,
        room: DealRooms.RED,
        price: 10,
        assets: DealRooms.RED.seller.assets,
    },
}

let accounts;
//let dealRoomDeployer: DealRoomDeployer;
let dealRoom: DealRoom;
//let erc20: Erc20Detailed;
//let erc721: Erc721Detailed;
let de: DeployedEnvironment = {};
let roomCount = 0;
const GAS = 6000000;
const ADMIN = 0;

async function getAccounts() {
    const provider = getProvider();
    return provider.listAccounts()
}

describe("Reset", () => {
    beforeAll(async () =>{
        const provider = getProvider();
        accounts = await provider.listAccounts()

        //Deploy all contracts as ADMIN and store references in `de` - DeployedEnvironment
        de = await deployAll()
        expect(de.dealRoomDeployer).toBeDefined()
        expect(de.erc20).toBeDefined()
        expect(de.erc721).toBeDefined()
        if (!de.erc20 || !de.erc721 || !de.dealRoomDeployer) {
            fail("Not all contracts deployed")
        }

        for (let actorId in Actors) {
            let actor = Actors[actorId]
            const address = accounts[actor.idx]
            await de.erc20.mint(address, actor.tokens)
            for (let asset of actor.assets) {
                //console.log("Minting", asset);
                await de.erc721.mint(address, asset)
            }
            expect(actor.tokens).toEqual(await de.erc20.balanceOf(address))
            expect(actor.assets.length).toEqual(await de.erc721.balanceOf(address))
        }
        expect(de.dealRoomDeployer.address).toBeDefined()
        expect(de.erc20.address).toBeDefined()
        expect(de.erc721.address).toBeDefined()
        expect(accounts.length).toBeGreaterThanOrEqual(5)
    });
    describe("Deploying Deal Rooms", async() => {
        it("Makes a room", async () => {
            if (!de.dealRoomDeployer) {
                fail("Not all contracts deployed")
            }
            //console.log("Making room", DealRooms.GREEN.id);
            await de.dealRoomDeployer.makeRoom(DealRooms.GREEN.id, DealRooms.GREEN.buyer.address, DealRooms.GREEN.seller.address);
            expect((await de.dealRoomDeployer.getAllRooms()).length).toEqual(1)
            expect(await de.dealRoomDeployer.roomCount()).toEqual(1)
            expect((await de.dealRoomDeployer.getUserRooms(DealRooms.GREEN.buyer.address)).length).toEqual(1)
            expect((await de.dealRoomDeployer.getUserRooms(DealRooms.GREEN.seller.address)).length).toEqual(1)
        });  
        it("Makes another room", async () => {
            if (!de.dealRoomDeployer) {
                fail("Not all contracts deployed")
            }
            await de.dealRoomDeployer.makeRoom(DealRooms.RED.id, DealRooms.RED.buyer.address, DealRooms.RED.seller.address);
            let rooms = await de.dealRoomDeployer.getAllRooms();
            expect(rooms.length).toEqual(2)
            expect(await de.dealRoomDeployer.roomCount()).toEqual(2)
            expect(await de.dealRoomDeployer.getUserRooms(DealRooms.RED.buyer.address)).toEqual(2)
            expect((await de.dealRoomDeployer.getUserRooms(DealRooms.RED.seller.address)).length).toEqual(1)
        }); 
        it("Fetches rooms", async () => {
            if (!de.erc20 || !de.erc721 || !de.dealRoomDeployer) {
                fail("Not all contracts deployed")
            }
            expect(await de.dealRoomDeployer.getRoom(DealRooms.GREEN.id)).not.toEqual(await de.dealRoomDeployer.getRoom(DealRooms.RED.id));
        }); 
    });

    describe("Using the GREEN deal room", async () => {
        beforeAll(async () => {
            if (!de.dealRoomDeployer) {
                fail("Not all contracts deployed")
            }
            let roomAddress = await de.dealRoomDeployer.getRoom(DealRooms.GREEN.id)
            dealRoom = await getDealRoomContract(roomAddress)
        })
        it("Make GREEN deal", async () => {
            if (!de.erc20 || !de.erc721 || !de.dealRoomDeployer) {
                fail("Not all contracts deployed")
            }
            const receipt = await dealRoom.makeDeal(
                Deals.GREEN_1.id,
                Deals.GREEN_1.arbitrator.address,
                de.erc20.address,
                de.erc721.address,
                Deals.GREEN_1.price,
                Deals.GREEN_1.assets
            )
            expect(receipt).toBeDefined()
            const deal = await dealRoom.methods.getDeal(Deals.GREEN_1.id).call()
            const [ id, arbitrator ] = deal;
            //console.log("DEAL: ", JSON.stringify(deal));
            expect(arbitrator).toEqual(Deals.GREEN_1.arbitrator.address)
        });
        it("Check GREEN deal status", async () => {
            const missingAssets = await dealRoom.methods.missingDealAssets(Deals.GREEN_1.id).call()
           // console.log(JSON.stringify(`MISSING ASSETS: [${missingAssets}]`))
            expect(missingAssets).toEqual(Deals.GREEN_1.assets.length)
            const missingTokens = await dealRoom.methods.missingDealTokens(Deals.GREEN_1.id).call()
            expect(missingTokens).toEqual(Deals.GREEN_1.price)
        });
        it("Deposit tokens", async () => {
            if (!de.erc20 || !dealRoom) {
                fail("Not all contracts deployed")
            }
            // Get connection to ERC20 for the Buyer
            let buyerErc20: Erc20Detailed = await getErc20Contract(de.erc20?.address, Deals.GREEN_1.room.buyer.address)
            await buyerErc20.transfer(dealRoom.options.address, Deals.GREEN_1.price)
            const missingTokens = await dealRoom.missingDealTokens(Deals.GREEN_1.id)
            expect(missingTokens).toEqual(0)
        });
        it("Deposit assets", async () => {
            if (!de.erc721 || !dealRoom) {
                fail("Not all contracts deployed")
            }
            // Get connection to ERC721 for the Seller
            let sellerErc721: Erc721Detailed = await getErc721Contract(de.erc721?.address, Deals.GREEN_1.room.seller.address)
            for (let asset of Deals.GREEN_1.assets) {
                await sellerErc721.transferFrom(Deals.GREEN_1.room.seller.address, dealRoom.options.address, asset)
            }
            const missingAssets = await dealRoom.methods.missingDealAssets(Deals.GREEN_1.id).call()
            expect(missingAssets).toEqual(0)
        });
        it("Check balances", async () => {
            if (!de.erc20 || !de.erc721 || !dealRoom) {
                fail("Not all contracts deployed")
            }
            let tokenBalance = await de.erc20.balanceOf(dealRoom.options.address)
            expect(tokenBalance).toEqual(Deals.GREEN_1.price)
            let assetBalance = await de.erc721.balanceOf(dealRoom.options.address)
            expect(assetBalance).toEqual(Deals.GREEN_1.assets.length)
        });
        it("Settle deal", async() => {
            if (!dealRoom) {
                fail("Not all contracts deployed")
            }
            let owner = await dealRoom.methods.getOwner().call()
            expect(owner).toEqual(ADMIN);
            await dealRoom.settle(Deals.GREEN_1.id)
            let status = await dealRoom.methods.getDealStatus(Deals.GREEN_1.id).call()
            expect(status).toEqual(3)
        });
        it("Claim tokens", async() => {
            if (!de.erc20) {
                fail("Not all contracts deployed")
            }

            // Get connection to ERC20 for the Seller
            let sellerErc20: Erc20Detailed = await getErc20Contract(de.erc20?.address, Deals.GREEN_1.room.seller.address)

            let oldBalance = await sellerErc20.balanceOf(Deals.GREEN_1.room.seller.address);
            await dealRoom.methods.withdrawDealTokens(Deals.GREEN_1.id).send({from: Deals.GREEN_1.room.seller.address});
            let newBalance = await de.erc20.balanceOf(Deals.GREEN_1.room.seller.address);
            expect(newBalance.toNumber()).toEqual(oldBalance.toNumber() + (Deals.GREEN_1.price));

        });
        it("Claim assets", async() => {
            if (!de.erc721) {
                fail("Not all contracts deployed")
            }
            // Get connection to ERC721 for the Buyer
            let buyerErc721: Erc721Detailed = await getErc721Contract(de.erc721?.address, Deals.GREEN_1.room.buyer.address)
            let oldBalance = await de.erc721.balanceOf(Deals.GREEN_1.room.buyer.address);
            await dealRoom.withdrawDealAssets(Deals.GREEN_1.id, Deals.GREEN_1.assets.length);     
            let newBalance = await buyerErc721.balanceOf(Deals.GREEN_1.room.buyer.address);
            expect(newBalance.toNumber()).toEqual(oldBalance.toNumber() + Deals.GREEN_1.assets.length);
        });
    });
});
