const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const ERC721Detailed = artifacts.require("ERC721Detailed.sol");
const ERC20Detailed = artifacts.require("ERC20Detailed.sol");
const DealRoomDeployer = artifacts.require("DealRoomDeployer.sol");
const DealRoom = artifacts.require("DealRoom.sol");

let erc20, erc721;
const buyerIdx = 2;
const sellerIdx = 3;
const Actors = {
    ALICE: {
        idx: 0,
        assets: [111,222,333,444],
        tokens: 100
    },
    BOB: {
        idx: 1,
        assets: [555,666,777,888],
        tokens: 100
    },
    CHARLIE: {
        idx: 2,
        assets: [],
        tokens: 100
    },    
    DANI: {
        idx: 3,
        assets: [],
        tokens: 100
    },    
    EDWARD:  {
        idx: 4,
        assets: [],
        tokens: 100
    },
};

const DealRooms = {
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

const Deals = {
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
let dealRoomDeployer;
let dealRoom;
let roomCount = 0;
const GAS = 6000000;
let ADMIN;

async function admin () {
    return (await web3.eth.getAccounts())[0];
}

contract("Reset", () => {
    before(async () =>{
        accounts = await web3.eth.getAccounts();
        adminAccount = await admin();
        dealRoomDeployer = await DealRoomDeployer.deployed();        
        erc20 = await ERC20Detailed.deployed();
        erc721 = await ERC721Detailed.deployed();

        for (actorId in Actors) {
            let actor = Actors[actorId];
            actor.address = accounts[actor.idx];
            await erc20.mint(actor.address, actor.tokens);
            for (asset of actor.assets) {
                //console.log("Minting", asset);
                await erc721.mint(actor.address, asset);
            }
            assert.equal(actor.tokens, (await erc20.balanceOf(actor.address)));
            assert.equal(actor.assets.length, (await erc721.balanceOf(actor.address)))
        }
        assert.ok(dealRoomDeployer.address);
        assert.ok(erc20.address);
        assert.ok(erc721.address);
        assert.isAtLeast(accounts.length, 5);
    });
    describe("Deploying Deal Rooms", async() => {
        it("Makes a room", async () => {
            //console.log("Making room", DealRooms.GREEN.id);
            await dealRoomDeployer.makeRoom(DealRooms.GREEN.id, DealRooms.GREEN.buyer.address, DealRooms.GREEN.seller.address, {from: adminAccount});
            assert.equal(1, (await dealRoomDeployer.getAllRooms()).length);
            assert.equal(1, await dealRoomDeployer.roomCount());
            assert.equal(1, (await dealRoomDeployer.getUserRooms(DealRooms.GREEN.buyer.address)).length);
            assert.equal(1, (await dealRoomDeployer.getUserRooms(DealRooms.GREEN.seller.address)).length);
        });  
        it("Makes another room", async () => {
            //console.log("Making room", DealRooms.RED.id);
            await dealRoomDeployer.makeRoom(DealRooms.RED.id, DealRooms.RED.buyer.address, DealRooms.RED.seller.address, {from: adminAccount});
            let rooms = await dealRoomDeployer.getAllRooms();
            assert.equal(2, rooms.length, "getAllRooms");
            assert.equal(2, await dealRoomDeployer.roomCount(), "roomCount" );
            rooms = await dealRoomDeployer.getUserRooms(DealRooms.RED.buyer.address)
            //console.log("buyer rooms:", JSON.stringify(rooms))
            assert.equal(2, rooms.length, "buyer rooms");
            assert.equal(1, (await dealRoomDeployer.getUserRooms(DealRooms.RED.seller.address)).length, "seller rooms");
        }); 
        it("Fetches rooms", async () => {
            assert.notEqual(await dealRoomDeployer.getRoom(DealRooms.GREEN.id), await dealRoomDeployer.getRoom(DealRooms.RED.id));
        }); 
    });

    describe("Using the GREEN deal room", async () => {
        before(async () => {
            let roomAddress = await dealRoomDeployer.getRoom(DealRooms.GREEN.id);
            dealRoom = await new web3.eth.Contract(JSON.parse(JSON.stringify(DealRoom.abi)), roomAddress);
        })
        it("Make GREEN deal", async () => {
            const receipt = await dealRoom.methods.makeDeal(
                Deals.GREEN_1.id,
                Deals.GREEN_1.arbitrator.address,
                erc20.address,
                erc721.address,
                Deals.GREEN_1.price,
                Deals.GREEN_1.assets
            ).send({from: adminAccount, gas: GAS});
            assert.ok(receipt);
            const deal = await dealRoom.methods.getDeal(Deals.GREEN_1.id).call();
            const [ id, arbitrator ] = deal;
            //console.log("DEAL: ", JSON.stringify(deal));
            assert.equal(arbitrator, Deals.GREEN_1.arbitrator.address);
        });
        it("Check GREEN deal status", async () => {
            const missingAssets = await dealRoom.methods.missingDealAssets(Deals.GREEN_1.id).call();
           // console.log(JSON.stringify(`MISSING ASSETS: [${missingAssets}]`));
            assert.equal(missingAssets, Deals.GREEN_1.assets.length);
            const missingTokens = await dealRoom.methods.missingDealTokens(Deals.GREEN_1.id).call();
            assert.equal(missingTokens, Deals.GREEN_1.price);
        });
        it("Deposit tokens", async () => {
            await erc20.transfer(dealRoom.options.address, Deals.GREEN_1.price, {from: Deals.GREEN_1.room.buyer.address, gas: GAS});
            const missingTokens = await dealRoom.methods.missingDealTokens(Deals.GREEN_1.id).call();
            assert.equal(missingTokens, 0);
        });
        it("Deposit assets", async () => {
            //console.log(`Transferring ${JSON.stringify(Deals.GREEN_1.assets)}`);
            for (asset of Deals.GREEN_1.assets) {
                //console.log(`Transferring ${asset}`);
                await erc721.transferFrom(Deals.GREEN_1.room.seller.address, dealRoom.options.address, asset, {from: Deals.GREEN_1.room.seller.address, gas: GAS});
            }
            const missingAssets = await dealRoom.methods.missingDealAssets(Deals.GREEN_1.id).call();
            assert.equal(missingAssets, 0);
        });
        it("Check balances", async () => {
            let tokenBalance = await erc20.balanceOf(dealRoom.options.address);
            assert.equal(tokenBalance, Deals.GREEN_1.price)
            let assetBalance = await erc721.balanceOf(dealRoom.options.address);
            assert.equal(assetBalance, Deals.GREEN_1.assets.length)
        });
        it("Settle deal", async() => {
            let owner = await dealRoom.methods.getOwner().call();
            assert.equal(owner, adminAccount);
            await dealRoom.methods.settle(Deals.GREEN_1.id).send({from: adminAccount, gas: GAS});
            let status = await dealRoom.methods.getDealStatus(Deals.GREEN_1.id).call();
            assert.equal(status, 3);
        });
        it("Claim tokens", async() => {
            let oldBalance = await erc20.balanceOf(Deals.GREEN_1.room.seller.address);
            await dealRoom.methods.withdrawDealTokens(Deals.GREEN_1.id).send({from: Deals.GREEN_1.room.seller.address});
            let newBalance = await erc20.balanceOf(Deals.GREEN_1.room.seller.address);
            assert.equal(newBalance.toNumber(), oldBalance.toNumber() + (Deals.GREEN_1.price));

        });
        it("Claim assets", async() => {
            let oldBalance = await erc721.balanceOf(Deals.GREEN_1.room.buyer.address);
            await dealRoom.methods.withdrawDealAssets(Deals.GREEN_1.id, Deals.GREEN_1.assets.length).send({from: Deals.GREEN_1.room.buyer.address, gas: GAS});     
            let newBalance = await erc721.balanceOf(Deals.GREEN_1.room.buyer.address);
            assert.equal(newBalance.toNumber(), oldBalance.toNumber() + Deals.GREEN_1.assets.length);
        });
    });
});
