import { BigNumber, BigNumberish, randomBytes } from "ethers/utils"
import { Signer, ethers } from "ethers"
import { ContractReceipt } from "ethers/contract"

import { MultiSigHashed } from "../ethereum/types/MultiSigHashed"
import { Erc20Detailed } from "../ethereum/types/Erc20Detailed"
import { DealRoom } from "../ethereum/types/DealRoom"
import { Erc721Detailed } from "../ethereum/types/Erc721Detailed"

import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json"

import * as Deployer from "../ethereum/deploy/deploy"
import * as ContractFactory from "./chain/prefabContractFactory"
import { DealRoomHub } from "ethereum/types/DealRoomHub"
// import { DealRoomFactory } from "ethereum/types/DealRoomFactory"
import * as MultiSigController from "./multiSigController"
// import { randomInt } from "lib/random"

export const ERROR_ROOM_NOT_LOADED = "ROOM_NOT_LOADED"
type MultiSigTransaction = MultiSigController.MultiSigTransaction

export type DealRoomDetails = {
    addr: string
    buyer: string
    seller: string
    arbitrator: string
    docApprover: string
    sensorApprover: string
    dealMultiSig: string
    agentMultiSig: string
}

export type Deal = {
    id?: BigNumberish
    erc20?: string
    erc721?: string
    price?: BigNumber
    assetItems?: BigNumberish[]
    agentConfirmations?: number
    dealConfirmations?: number
    dealTransaction?: MultiSigTransaction
    agentTransaction?: MultiSigTransaction
    status?: number
}

export type AssetStatus = {
    assetId: BigNumber,
    owner: string
}

export const DealStatus = {
    Unknown: 0,
    Open: 1,
    Cancelled: 2,
    Settled: 3       
}

//TODO: Make a DealRoomFactory to simplify constructor for DealRoomController
//DealRoomController's constructor would only take an address.
//DealRoomFactory(DealRoomCreateParams) {}
//
export class DealRoomController {
    private _signer: Signer
    private _dealRoomAddress?: string
    private _dealRoomHubAddress?: string
    public dealRoomContract?: DealRoom
    public dealRoomHubContract?: DealRoomHub
    public details?: DealRoomDetails


    //--- Public methods ------------------------------------- //

    //--- Static methods

    // Deploy a hub contract
    public static async deployHub(signer: Signer): Promise<DealRoomHub> {
        return Deployer.deployDealRoomHub(await signer.getAddress(), signer)
    }

    // Deploy a room contract
    public static async deployRoom(params: Deployer.DealRoomCreateParams, signer: Signer): Promise<string> {
        try {
            const dr = await Deployer.deployDealRoom(params, await signer.getAddress(), signer)
            return dr.addr;
        }
        catch (e) {
            throw Error(`_deployDealRoom: ${e}`)
        }
    }

    // Get a list of rooms from a hub
    public static async getRooms(hubAddress: string, signer: Signer): Promise<string[]> {
        const hubContract = await ContractFactory.getDealRoomHubContract(hubAddress, signer)
        return hubContract.getUserRooms(await signer.getAddress())
    }

    //--- Instance methods

    // Constructor - Make an object for controlling a specific Deal
    constructor(hubAddress: string, dealRoomAddress: string, signer: Signer) {
        this._signer = signer
        this._dealRoomHubAddress = hubAddress
        this._dealRoomAddress = dealRoomAddress
    }

    // Fetch resources
    public async init() {
        // If instantiating with just a dealroom address,
        if (this._dealRoomAddress) {
            this.dealRoomContract = await this.getDealRoomContract()
        } 

        // Ask the deal room hub for all the details
        this.dealRoomHubContract = await this._getDealRoomHubContract();
        this.details = await this._getRoomDetails()
    }

    public async depositDealCoins(id: BigNumberish, amount: BigNumberish): Promise<ContractReceipt> {
        console.log("depositDealCoins()")
        const tokenContract = await this._getDealTokenContract(id)
        const roomContract = await this._getDealRoomContract()
        return (await tokenContract.transfer(roomContract.address, amount)).wait()
    }

    public async depositDealAssets(id: BigNumberish, items: BigNumberish[]): Promise<ContractReceipt[]> {
        console.log("depositDealAssets()")
        const assetContract = await this._getDealAssetContract(id)
        const roomContract = await this._getDealRoomContract()
        const receipts: ContractReceipt[] = []
        for (const item of items) {
            receipts.push(await (await assetContract.transferFrom(await this._signer.getAddress(), roomContract.address, item)).wait())
        }
        return receipts  
    }

    public async getMyTokenBalance(id: BigNumberish): Promise<BigNumberish> {
        const tokenContract = await this._getDealTokenContract(id)
        return tokenContract.balanceOf(await this._signer.getAddress())
    }

    public async getMyAssetBalance(id: BigNumberish): Promise<BigNumberish> {
        const assetContract = await this._getDealAssetContract(id)
        return assetContract.balanceOf(await this._signer.getAddress())
    }

    public async getAssetOwner(dealId: BigNumberish, assetId: BigNumberish): Promise<string> {
        const assetContract = await this._getDealAssetContract(dealId)
        return assetContract.ownerOf(assetId)
    }

    public async getDealRoomContract(): Promise<DealRoom> {
        return this._getDealRoomContract()
    }

    public async getBuyer(): Promise<string> {
        const contract: DealRoom = await this._getDealRoomContract()
        return await contract.getBuyer()
    }

    public async getSeller(): Promise<string> {
        const contract: DealRoom = await this._getDealRoomContract()
        return await contract.getSeller()
    }

    public async getAddress(): Promise<string> {
        //If already cached, return it
        if (this._dealRoomAddress) {
            return this._dealRoomAddress
        } 
        //Otherwise, fetch it (which will cache it for next time)
        else {
            const contract = await this._getDealRoomContract()
            return contract.address
        }
    }

    public async makeDeal(deal: Deal): Promise<Deal> {
        const nextDealId = await this.getDealCount() //randomInt(2^32)
        const contract = await this._getDealRoomContract()
        const tx = await contract.makeDeal(deal.erc20, deal.erc721, deal.price, deal.assetItems)
        const receipt = await tx.wait()
        //console.log(`makeDeal result`, JSON.stringify(receipt, undefined, 4))
        //const multisig = await this._getMultisigContract()
        
        return this.getDeal(nextDealId)
    }

    public async getDeal(dealId: BigNumberish): Promise<Deal> {
        try {
            // Get deal from contract
            const contract = await this._getDealRoomContract()
            let dealStruct: any
            try {
                dealStruct = await contract.getDeal(dealId)
                
            } catch (e) {
                throw new Error("Deal not found")
            }
            
            // Get multisigs from Room
            const dealMultiSigContract: MultiSigHashed = await this._getDealMultiSigContract();
            const agentMultiSigContract: MultiSigHashed = await this._getAgentMultiSigContract();
            
            // Get deal transaction and confirmations (if any) from main multisig
            const dealTransaction = await this.getDealSettleTransaction(dealId)
            let dealConfirmations: number = 0
            if (dealTransaction) {
                dealConfirmations = (await dealMultiSigContract.getConfirmationCount(dealTransaction.id)).toNumber()
            }
            
            // Get agent transaction and confirmations (if any) from agent multisig
            const agentTransaction = await this.getAgentDealSettleTransaction(dealId) //TODO: Optimise this
            let agentConfirmations: number = 0
            if (agentTransaction) {
                agentConfirmations = (await agentMultiSigContract.getConfirmationCount(agentTransaction.id)).toNumber()
            }  
            console.log("dealTransaction", JSON.stringify(dealTransaction, undefined, 4))

            // Return the Deal
            return {
                id: dealId,
                erc20: dealStruct.erc20,
                erc721: dealStruct.erc721,
                price: dealStruct.price,
                assetItems: dealStruct.assetItems.map(item=>item.toNumber()),
                dealTransaction,
                agentTransaction,
                dealConfirmations,
                agentConfirmations,
                status: dealStruct.status,
            } as Deal
        }
        catch (e) {
            console.error(e)
            return null
        }
    }

    public async getDealCount(): Promise<number> {
        const contract = await this._getDealRoomContract()
        return (await contract.getDealCount()).toNumber()
    }

    public async getDeals(): Promise<Deal[]> {
        try {
            const contract = await this._getDealRoomContract()
            const dealCount = await this.getDealCount()
            const result: Deal[] = []
            for (let i = 0; i < dealCount ; i ++) {
                result.push(await this.getDeal(i))
            }
            return result
        }
        catch (e) {
            throw Error(`getDeals(): ${e}`)
        }
    }
    public async getDealMissingAssets(id: BigNumberish): Promise<number> {
        const contract = await this._getDealRoomContract()
        return (await contract.missingDealAssets(id)).toNumber()
    }

    public async getDealAssetStatus(dealId: BigNumberish): Promise<AssetStatus[]> {
        const deal = await this.getDeal(dealId)
        
        const results: AssetStatus[] = []
        for (const assetId of deal.assetItems) {
            try {
                const owner = await this.getAssetOwner(dealId, assetId)
                results.push({
                    assetId: new BigNumber(assetId),
                    owner
                })
            } catch (e) {
                console.warn(`Error getting asset status for ${assetId}: ${e}`)
            }

        }
        return results
    }

    public async getDealMissingCoins(id: BigNumberish): Promise<number> {
        const contract = await this._getDealRoomContract()
        return (await contract.missingDealCoins(id)).toNumber()
    }

    // Send a new transaction to the main multisig to settle the deal
    public async proposeMainSettleDeal(dealId: BigNumberish): Promise<MultiSigController.MultiSigSubmissionResult> {
        console.log(`Proposing settle deal ${dealId}`)

        const dealRoomContract: DealRoom = await this.getDealRoomContract()
        const dealMultisigContract: MultiSigHashed = await this._getDealMultiSigContract();

        const result = await MultiSigController.submitMultiSigTransaction(
            dealMultisigContract,
            dealRoomContract.address,
            DealRoomCompiled.abi,
            "settle",
            [dealId],
            this._signer
        )
        console.log(`*** Submitted main multisig transaction ${result.id}:${result.hash}`)
        return result
    }

    // Send a new transaction to the agents multisig to "approve" the deal in the main multisig
    public async proposeAgentsSettleDeal(dealId: BigNumberish): Promise<void> {

        console.log("proposeAgentsSettleDeal()")

            const deal: Deal = await this.getDeal(dealId)

            // const dealRoomContract: DealRoom = await this.getDealRoomContract()
            const dealMultiSigContract: MultiSigHashed = await this._getDealMultiSigContract();
            const agentMultiSigContract: MultiSigHashed = await this._getAgentMultiSigContract();
            
            //Submit a transaction to approve a transaction
            //If the deal has a proposal transaction,
            //if (deal.dealTransaction) {
            /*if (deal.agentTransaction) {
                // Agent proposal already there, so just approve it
                MultiSigController.approveMultiSigTransaction(agentMultiSigContract, deal.agentTransaction.id, this._signer)
            } else {*/
                // Make a new agent proposal to approve deal settlement proposal
                const result = await MultiSigController.submitDuplexMultiSigProposal(
                    agentMultiSigContract,
                    dealMultiSigContract,
                    this._dealRoomAddress,
                    DealRoomCompiled.abi,
                    "settle",
                    [dealId],
                    this._signer
                )
                console.log(`*** Submitted agent multisig transaction ${result.id}:${result.hash}`)
            //}
            //} else {
            //    throw new Error("No deal proposal yet")
            //console.log("proposeSettleDeal() complete")     
    }

    public async approveDealSettlementProposal(dealId: BigNumberish): Promise<ContractReceipt> {
        const multiSigContract = await this._getDealMultiSigContract()
        const transaction = await this.getDealSettleTransaction(dealId)
        const receipt = await MultiSigController.approveMultiSigTransaction(multiSigContract, transaction.id, this._signer)
        return receipt
    }

    public async approveAgentSettlementProposal(dealId: BigNumberish): Promise<ContractReceipt> {
        const multisigContract = await this._getAgentMultiSigContract()
        //const transactionId = await this.getDealSettleTransactionId(dealId) // await getMultiSigApprovalTransactionId(dealId, multisigContract)
        const transactionId = dealId;
        const receipt = await MultiSigController.approveMultiSigTransaction(multisigContract, transactionId, this._signer)
        return receipt
    }

    private async getDealSettleTransaction(dealId: BigNumberish): Promise<MultiSigTransaction | null> {
        let result: MultiSigTransaction = null
        const multiSigContract = await this._getDealMultiSigContract()
        // Find transaction that corresponds to settle(dealId)
        const transactions = await MultiSigController.getTransactions(multiSigContract)
        if (transactions.length) {
            result = transactions.find((transaction: MultiSigTransaction) => {
                const decodedTransaction = MultiSigController.decodeDealRoomTransaction(transaction.data)
                if (decodedTransaction.name === "settle" && Number(decodedTransaction.params[0].value) === dealId) 
                return true
            })        
            return result ?? null
        } else {
            return null
        }    
    }

    private async getAgentDealSettleTransaction(dealId: BigNumberish): Promise<MultiSigTransaction | null> {
        let result: MultiSigTransaction = null
        const dealSettleTransaction = await this.getDealSettleTransaction(dealId)
        const multiSigContract = await this._getAgentMultiSigContract()
        const transactions = await MultiSigController.getTransactions(multiSigContract)
        if (transactions.length) {
            result = transactions.find((transaction: MultiSigTransaction) => {
                const decodedTransaction = MultiSigController.decodeMultiSigTransaction(transaction.data)
                if (decodedTransaction.name === "submitTransaction") { //TODO: Also ceck encoded params are "settle", [dealId]
                    return true
                } 
            })
            return result
        } else {
            return null
        }       
    }

    public async withdrawDealCoins(dealId: BigNumberish): Promise<ContractReceipt> {
        const contract = await this._getDealRoomContract()
        const transaction = await contract.withdrawDealCoins(dealId)
        const receipt = await transaction.wait() 
        return receipt      
    }

    public async withdrawDealAssets(dealId: BigNumberish): Promise<ContractReceipt> {
        const contract = await this._getDealRoomContract()
        const deal = await this.getDeal(dealId)
        const transaction = await contract.withdrawDealAssets(dealId, deal.assetItems.length)
        const receipt = await transaction.wait() 
        return receipt      
    }

    //--- Private methods ------------------------------------- //

    private async signerAddress(): Promise<string> {
        return this._signer.getAddress();
    }
    
    // TODO: Cache the contract
    private async _getDealRoomContract(): Promise<DealRoom> {
        try {
            //Connect to the contract with my signer
            const contract = await ContractFactory.getDealRoomContract(this._dealRoomAddress, this._signer)
            return contract
        }
        catch (e) {
            throw Error(`Failed to get DealRoom contract: ${e}`)
        }
    }

    private async _getDealRoomHubContract(): Promise<DealRoomHub> {
        try {
            //If the contract hasn't been instantiated yet,
            if (this._dealRoomHubAddress == undefined) {
                throw Error("Deal room hub not yet created")
            }
            //Connect to the contract with my signer
            const contract = await ContractFactory.getDealRoomHubContract(this._dealRoomHubAddress, this._signer)
            return contract
        }
        catch (e) {
            throw Error(`Failed to get DealRoom contract: ${e}`)
        }

    }

    private async _getDealTokenContract(id: BigNumberish): Promise<Erc20Detailed> {
        const deal = await this.getDeal(id)
        return ContractFactory.getErc20Contract(deal.erc20, this._signer)
    }

    private async _getDealAssetContract(id: BigNumberish): Promise<Erc721Detailed> {
        const deal = await this.getDeal(id)
        return ContractFactory.getErc721Contract(deal.erc721, this._signer)
    }

    private async _getDealMultiSigContract(): Promise<MultiSigHashed> {
        if (!this.details) {
            throw new Error(ERROR_ROOM_NOT_LOADED)
        }
        return await ContractFactory.getMultiSigContract(this.details.dealMultiSig, this._signer)
    }

    private async _getAgentMultiSigContract(): Promise<MultiSigHashed> {
        if (!this.details) {
            throw new Error(ERROR_ROOM_NOT_LOADED)
        }
        return await ContractFactory.getMultiSigContract(this.details.agentMultiSig, this._signer)
    }

    private async _getRoomDetails(): Promise<DealRoomDetails> {
        return this.dealRoomHubContract.getRoom(this._dealRoomAddress)
    }
}
