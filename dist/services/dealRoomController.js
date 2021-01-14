var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BigNumber } from "ethers/utils";
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json";
import * as Deployer from "../ethereum/deploy/deploy";
import { MultiSigController } from "./multiSigController";
import * as ContractFactory from "./chain/prefabContractFactory";
export const ERROR_ROOM_NOT_LOADED = "ROOM_NOT_LOADED";
export const DealStatus = {
    Unknown: 0,
    Open: 1,
    Cancelled: 2,
    Settled: 3
};
export class DealRoomController {
    //--- Instance methods
    constructor(hubAddress, dealRoomAddress, signer) {
        this._signer = signer;
        this._dealRoomHubAddress = hubAddress;
        this._dealRoomAddress = dealRoomAddress;
    }
    //--- Public methods ------------------------------------- //
    //--- Static methods
    // Deploy a hub contract
    static deployHub(signer) {
        return __awaiter(this, void 0, void 0, function* () {
            return Deployer.deployDealRoomHub(signer);
        });
    }
    // Deploy a room contract
    static deployRoom(params, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dr = yield Deployer.deployDealRoom(params, yield signer.getAddress(), signer);
                return dr.addr;
            }
            catch (e) {
                throw Error(`_deployDealRoom: ${e}`);
            }
        });
    }
    // Get a list of rooms from a hub
    static getRooms(hubAddress, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const hubContract = yield ContractFactory.getDealRoomHubContract(hubAddress, signer);
            return hubContract.getUserRooms(yield signer.getAddress());
        });
    }
    // Fetch resources
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // If instantiating with just a dealroom address,
            if (this._dealRoomAddress) {
                this.dealRoomContract = yield this.getDealRoomContract();
            }
            // Ask the deal room hub for all the details
            this.dealRoomHubContract = yield this._getDealRoomHubContract();
            this.details = yield this._getRoomDetails();
        });
    }
    depositDealCoins(id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenContract = yield this._getDealTokenContract(id);
            const roomContract = yield this._getDealRoomContract();
            return (yield tokenContract.transfer(roomContract.address, amount)).wait();
        });
    }
    depositDealAssets(id, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetContract = yield this._getDealAssetContract(id);
            const roomContract = yield this._getDealRoomContract();
            const receipts = [];
            for (const item of items) {
                receipts.push(yield (yield assetContract.transferFrom(yield this._signer.getAddress(), roomContract.address, item)).wait());
            }
            return receipts;
        });
    }
    getMyTokenBalance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenContract = yield this._getDealTokenContract(id);
            return tokenContract.balanceOf(yield this._signer.getAddress());
        });
    }
    getMyAssetBalance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetContract = yield this._getDealAssetContract(id);
            return assetContract.balanceOf(yield this._signer.getAddress());
        });
    }
    getAssetOwner(dealId, assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetContract = yield this._getDealAssetContract(dealId);
            return assetContract.ownerOf(assetId);
        });
    }
    getDealRoomContract() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getDealRoomContract();
        });
    }
    getBuyer() {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._getDealRoomContract();
            return yield contract.getBuyer();
        });
    }
    getSeller() {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._getDealRoomContract();
            return yield contract.getSeller();
        });
    }
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            //If already cached, return it
            if (this._dealRoomAddress) {
                return this._dealRoomAddress;
            }
            //Otherwise, fetch it (which will cache it for next time)
            else {
                const contract = yield this._getDealRoomContract();
                return contract.address;
            }
        });
    }
    makeDeal(deal) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextDealId = yield this.getDealCount(); //randomInt(2^32)
            const contract = yield this._getDealRoomContract();
            const tx = yield contract.makeDeal(deal.erc20, deal.erc721, deal.price, deal.assetItems);
            const receipt = yield tx.wait();
            return this.getDeal(nextDealId);
        });
    }
    getDeal(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get deal from contract
                const contract = yield this._getDealRoomContract();
                let dealStruct;
                try {
                    dealStruct = yield contract.getDeal(dealId);
                }
                catch (e) {
                    throw new Error("Deal not found");
                }
                // Get multisigs from Room
                const dealMultiSig = yield this._getDealMultiSig();
                const agentMultiSig = yield this._getAgentMultiSig();
                // Get deal transaction and confirmations (if any) from main multisig
                const dealTransaction = yield this._getDealSettleTransaction(dealId);
                let dealConfirmations = 0;
                if (dealTransaction) {
                    dealConfirmations = (yield dealMultiSig.getConfirmations(dealTransaction.hash)).length;
                }
                // Get agent transaction and confirmations (if any) from agent multisig
                const agentTransaction = yield this._getAgentDealSettleTransaction(dealId); //TODO: Optimise this
                let agentConfirmations = 0;
                if (agentTransaction) {
                    agentConfirmations = (yield agentMultiSig.getConfirmations(agentTransaction.hash)).length;
                }
                // Return the Deal
                return {
                    id: dealId,
                    erc20: dealStruct.erc20,
                    erc721: dealStruct.erc721,
                    price: dealStruct.price,
                    assetItems: dealStruct.assetItems.map(item => item.toNumber()),
                    dealTransaction,
                    agentTransaction,
                    dealConfirmations,
                    agentConfirmations,
                    status: dealStruct.status,
                };
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    getDealCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._getDealRoomContract();
            return (yield contract.getDealCount()).toNumber();
        });
    }
    getDeals() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contract = yield this._getDealRoomContract();
                const dealCount = yield this.getDealCount();
                const result = [];
                for (let i = 0; i < dealCount; i++) {
                    result.push(yield this.getDeal(i));
                }
                return result;
            }
            catch (e) {
                throw Error(`getDeals(): ${e}`);
            }
        });
    }
    getDealMissingAssets(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._getDealRoomContract();
            return (yield contract.missingDealAssets(id)).toNumber();
        });
    }
    getDealAssetStatus(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deal = yield this.getDeal(dealId);
            const results = [];
            for (const assetId of deal.assetItems) {
                try {
                    const owner = yield this.getAssetOwner(dealId, assetId);
                    results.push({
                        assetId: new BigNumber(assetId),
                        owner
                    });
                }
                catch (e) {
                    console.warn(`Error getting asset status for ${assetId}: ${e}`);
                }
            }
            return results;
        });
    }
    getDealMissingCoins(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._getDealRoomContract();
            return (yield contract.missingDealCoins(id)).toNumber();
        });
    }
    proposeSettleDeal(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ([this.details.arbitrator, this.details.buyer, this.details.seller].includes(yield this.signerAddress())) {
                return this._proposeAgentsSettleDeal(dealId);
            }
            else {
                return this._proposeMainSettleDeal(dealId);
            }
        });
    }
    withdrawDealCoins(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._getDealRoomContract();
            const transaction = yield contract.withdrawDealCoins(dealId);
            const receipt = yield transaction.wait();
            return receipt;
        });
    }
    withdrawDealAssets(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield this._getDealRoomContract();
            const deal = yield this.getDeal(dealId);
            const transaction = yield contract.withdrawDealAssets(dealId, deal.assetItems.length);
            const receipt = yield transaction.wait();
            return receipt;
        });
    }
    getAgentMultiSigContractAddress() {
        return this.details.agentMultiSig;
    }
    getDealMultiSigContractAddress() {
        return this.details.dealMultiSig;
    }
    //--- Private methods ------------------------------------- //
    signerAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._signer.getAddress();
        });
    }
    // TODO: Cache the contract
    _getDealRoomContract() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Connect to the contract with my signer
                const contract = yield ContractFactory.getDealRoomContract(this._dealRoomAddress, this._signer);
                return contract;
            }
            catch (e) {
                throw Error(`Failed to get DealRoom contract: ${e}`);
            }
        });
    }
    _getDealRoomHubContract() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //If the contract hasn't been instantiated yet,
                if (this._dealRoomHubAddress == undefined) {
                    throw Error("Deal room hub not yet created");
                }
                //Connect to the contract with my signer
                const contract = yield ContractFactory.getDealRoomHubContract(this._dealRoomHubAddress, this._signer);
                return contract;
            }
            catch (e) {
                throw Error(`Failed to get DealRoom contract: ${e}`);
            }
        });
    }
    _getDealTokenContract(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deal = yield this.getDeal(id);
            return ContractFactory.getErc20Contract(deal.erc20, this._signer);
        });
    }
    _getDealAssetContract(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deal = yield this.getDeal(id);
            return ContractFactory.getErc721Contract(deal.erc721, this._signer);
        });
    }
    _getDealMultiSig() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.details) {
                throw new Error(ERROR_ROOM_NOT_LOADED);
            }
            const msController = new MultiSigController(this.details.dealMultiSig, this._signer);
            yield msController.init();
            return msController;
        });
    }
    _getAgentMultiSig() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.details) {
                throw new Error(ERROR_ROOM_NOT_LOADED);
            }
            const msController = new MultiSigController(this.details.agentMultiSig, this._signer);
            yield msController.init();
            return msController;
        });
    }
    _getRoomDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dealRoomHubContract.getRoom(this._dealRoomAddress);
        });
    }
    _getDealSettleTransaction(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            const multiSigContract = yield this._getDealMultiSig();
            // Find transaction that corresponds to settle(dealId)
            const transactions = yield multiSigContract.getTransactions();
            if (transactions.length) {
                result = transactions.find((transaction) => {
                    const decodedTransaction = MultiSigController.decodeDealRoomTransaction(transaction.data);
                    if (decodedTransaction.name === "settle" && Number(decodedTransaction.params[0].value) === dealId)
                        return true;
                });
                return result !== null && result !== void 0 ? result : null;
            }
            else {
                return null;
            }
        });
    }
    _getAgentDealSettleTransaction(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            const multiSigContract = yield this._getAgentMultiSig();
            const transactions = yield multiSigContract.getTransactions();
            if (transactions.length) {
                result = transactions.find((transaction) => {
                    const decodedTransaction = MultiSigController.decodeMultiSigTransaction(transaction.data);
                    if (decodedTransaction.name === "submitTransaction") { //TODO: Also ceck encoded params are "settle", [dealId]
                        return true;
                    }
                });
                return result;
            }
            else {
                return null;
            }
        });
    }
    // Send a new transaction to the main multisig to settle the deal
    _proposeMainSettleDeal(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dealRoomContract = yield this.getDealRoomContract();
            const dealMultiSig = yield this._getDealMultiSig();
            const hash = yield dealMultiSig.submitMultiSigTransaction(dealRoomContract.address, DealRoomCompiled.abi, "settle", [dealId]);
            return hash;
        });
    }
    // Send a new transaction to the agents multisig to "approve" the deal in the main multisig
    _proposeAgentsSettleDeal(dealId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deal = yield this.getDeal(dealId);
            const agentMultiSig = yield this._getAgentMultiSig();
            //Submit a transaction to approve a transaction
            const roomContract = yield this._getDealRoomContract();
            // Make a new agent proposal to approve deal settlement proposal
            const hash = yield agentMultiSig.submitDuplexMultiSigProposal(this.getDealMultiSigContractAddress(), roomContract.address, DealRoomCompiled.abi, "settle", [dealId]);
            return hash;
        });
    }
}
