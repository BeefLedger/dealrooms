import { BigNumber, BigNumberish } from "ethers/utils"
import { Signer, ethers } from "ethers"
import { ContractReceipt } from "ethers/contract"

import { MultiSigWallet } from "../ethereum/types/MultiSigWallet"
import { Erc20Detailed } from "../ethereum/types/Erc20Detailed"
import { DealRoom } from "../ethereum/types/DealRoom"
import { Erc721Detailed } from "../ethereum/types/Erc721Detailed"

import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json"
import * as Deployer from "../ethereum/deploy/deploy"
import * as ContractFactory from "./chain/prefabContractFactory"
import { DealRoomHub } from "ethereum/types/DealRoomHub"
import { DealRoomFactory } from "ethereum/types/DealRoomFactory"

export const ERROR_NOT_MUTLISIG_OWNER = "NOT_MULTISIG_OWNER"
export const ERROR_ROOM_NOT_LOADED = "ROOM_NOT_LOADED"

export type DealRoomDetails = {
    addr: string
    buyer: string
    seller: string
    arbitrator: string
    docApprover: string
    sensorApprover: string
    mainMultiSig: string
    agentsMultiSig: string
}

export type Deal = {
    id?: BigNumberish
    erc20?: string
    erc721?: string
    price?: BigNumber
    assetItems?: BigNumberish[]
    multisigTransactionId?: BigNumberish
    status?: number
}

export type AssetStatus = {
    assetId: BigNumber,
    owner: string
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
    public static async getRooms(hubAddress: string, userAddress: string): Promise<string[]> {
        const hubContract = await ContractFactory.getDealRoomHubContract(hubAddress, userAddress)
        return hubContract.getUserRooms(userAddress)
    }

    public static getSubmittedTransactionId(receipt: ContractReceipt) {
        const submissionEvents = receipt.events?.filter(evt => evt.event === 'Submission')
        if (submissionEvents) { 
            if (submissionEvents.length > 0) {
                if (submissionEvents.length === 1) {
                    const transactionId: BigNumberish = (submissionEvents[0]?.args as any).transactionId
                    return transactionId
                }
                throw new Error(ERROR_MULTIPLE_SUBMISSION_EVENTS)
            }
        } 
        return new Error(ERROR_NO_SUBMISSION_FOUND)
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

    public async depositDealTokens(id: BigNumberish, amount: BigNumberish): Promise<ContractReceipt> {
        console.log("depositDealTokens()")
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
        const nextDealId = await this.getDealCount()
        const contract = await this._getDealRoomContract()
        const tx = await contract.makeDeal(deal.erc20, deal.erc721, deal.price, deal.assetItems)
        const receipt = await tx.wait()
        //console.log(`makeDeal result`, JSON.stringify(receipt, undefined, 4))
        //const multisig = await this._getMultisigContract()
        
        return this.getDeal(nextDealId)
    }

    public async getDeal(id: BigNumberish): Promise<Deal> {
        try {
            const contract = await this._getDealRoomContract()
            const response = await contract.getDeal(id)
            return {
                id: response.id.toNumber(),
                erc20: response.erc20,
                erc721: response.erc721,
                price: response.price,
                assetItems: response.assetItems.map(item=>item.toNumber()),
                status: response.status,
            } as Deal
        }
        catch (e) {
            console.error(e)
            throw Error(`getDeal(): ${e}`)
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
        debugger
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

    public async getDealMissingTokens(id: BigNumberish): Promise<number> {
        const contract = await this._getDealRoomContract()
        return (await contract.missingDealTokens(id)).toNumber()
    }

    // Send a proposal transaction to the agents multisig to send an approval transaction to the main multisig
    public async agentProposeSettleDeal(dealId: BigNumberish, transactionId: BigNumberish): Promise<BigNumberish> {
        console.log("proposeSettleDeal()")
        const agentsMultisigContract: MultiSigWallet = await this._getAgentsMultisigContract()
        const mainMultisigContract: MultiSigWallet = await this._getMainMultisigContract()
        
        try {
            const deal: Deal = await this.getDeal(dealId)

            const dealRoomContract: DealRoom = await this.getDealRoomContract()
            const mainMultisigContract: MultiSigWallet = await this._getMainMultisigContract();
            const owners = await mainMultisigContract.getOwners()

            //Make the transaction  
            const encodedData = new ethers.utils.Interface(DealRoomCompiled.abi).functions.settle.encode([deal.id])

            //const encodedData = dealRoomContract.interface.encodeFunctionData("settle", [deal.id])
            const transaction = await mainMultisigContract.submitTransaction(dealRoomContract.address, 0, encodedData)
            const receipt = await transaction.wait() 
            
            //Obtain the transaction ID created in the multisig
            try {
                if (receipt.events) {
                    const submissionEvents = receipt.events?.filter(evt => evt.event === 'Submission')
                    if (submissionEvents) { 
                        if (submissionEvents.length > 0) {
                            if (submissionEvents.length === 1) {
                                const transactionId: BigNumberish = (submissionEvents[0]?.args as any).transactionId
                                return transactionId
                            }
                            throw `More than one submission event`
                        }

                    } 
                }
                throw `No submission events`         
            }
            catch (e) {
                //console.error(JSON.stringify(e, undefined, 4))
                throw `Error getting new transaction ID: ${e}`
            }
        }
        finally {
            console.log("proposeSettleDeal() complete")
        }
    }

    public proposeAgentsSignoff(dealId: BigNumberish): Promise<BigNumberish> {

    }

    public approveAgentsSignoff(dealId: BigNumberish, transactionId: BigNumberish): Promise<ContractReceipt>  {

    }

    // Send a transaction to the main multisig
    public async proposeSettleDeal(dealId: BigNumberish): Promise<BigNumberish> {

        console.log("proposeSettleDeal()")
        try {
            const deal: Deal = await this.getDeal(dealId)

            const dealRoomContract: DealRoom = await this.getDealRoomContract()
            const mainMultisigContract: MultiSigWallet = await this._getMainMultisigContract();
            const owners = await mainMultisigContract.getOwners()

            //Check that the current user is an owner
            if (!owners.includes(await this.signerAddress())) {
                throw new Error(ERROR_NOT_MUTLISIG_OWNER)
            }

            //Make the transaction  
            const encodedData = new ethers.utils.Interface(DealRoomCompiled.abi).functions.settle.encode([deal.id])

            //const encodedData = dealRoomContract.interface.encodeFunctionData("settle", [deal.id])
            const transaction = await mainMultisigContract.submitTransaction(dealRoomContract.address, 0, encodedData)
            const receipt = await transaction.wait() 
            
            //Obtain the transaction ID created in the multisig
            try {
                if (receipt.events) {
                    return DealRoomController.getSubmittedTransactionId(receipt)
                }
                throw `No submission events`         
            }
            catch (e) {
                //console.error(JSON.stringify(e, undefined, 4))
                throw `Error getting new transaction ID: ${e}`
            }
        }
        finally {
            console.log("proposeSettleDeal() complete")
        }      
    }

    public async approveSettlementProposal(transactionId: BigNumberish): Promise<ContractReceipt> {
        const multisigContract = await this._getMainMultisigContract()

        const transaction = await multisigContract.confirmTransaction(transactionId, {gasLimit: 999999})
        const receipt = await transaction.wait() 
        return receipt
    }

    public async manualSettleDeal(dealId: BigNumberish): Promise<ContractReceipt> {
        const contract = await this._getDealRoomContract()
        const transaction = await contract.settle(dealId)
        const receipt = await transaction.wait() 
        return receipt
    }

    public async withdrawDealTokens(dealId: BigNumberish): Promise<ContractReceipt> {
        const contract = await this._getDealRoomContract()
        const transaction = await contract.withdrawDealTokens(dealId)
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

    /*public async settleDeal(transactionId: BigNumberish): Promise<Event> {
        
        const multisigContract = await this._getMultisigContract()
        const transaction = await multisigContract.executeTransaction(transactionId)
        const receipt = await transaction.wait() 
        if (receipt.events) {
            const failureEvents = receipt.events.filter(evt=>evt.event === 'ExecutionFailure')
            const successEvents = receipt.events.filter(evt=>evt.event === 'Execution')

            if (failureEvents && failureEvents.length > 0) {
                console.error(`Deal settlement failed:\n${JSON.stringify(failureEvents[0], undefined, 4)}`)
                throw `Deal settlement failed: Failure event detected`
            }
            if (successEvents && successEvents.length > 0) {
                console.error(`Deal settlement succeeded:\n${JSON.stringify(successEvents[0], undefined, 4)}`)
                return successEvents[0]
            }
            
        }
        throw `Deal settlement failed: No success events detected`
    }
*/
    /*
    public async settleDeal(id: BigNumberish): Promise<ContractReceipt> {

    }
    */
    //--- Private methods ------------------------------------- //

    private async signerAddress(): Promise<string> {
        return this._signer.getAddress();
    }
    
    // TODO: Cache the contract
    private async _getDealRoomContract(): Promise<DealRoom> {
        try {
            console.log("_getDealRoomContract()")
            //If the contract hasn't been instantiated yet,
            if (this._dealRoomAddress == undefined) {
                throw Error("Deal Room not yet created")
            }
            //Connect to the contract with my signer
            console.log(`prefabContracts.getDealRoomContract(${this._dealRoomAddress}`)//, ${this._signer})`)
            const contract = await ContractFactory.getDealRoomContract(this._dealRoomAddress, this._signer)
            return contract
        }
        catch (e) {
            throw Error(`Failed to get DealRoom contract: ${e}`)
        }
    }

    private async _getDealRoomHubContract(): Promise<DealRoomHub> {
        try {
            console.log("_getDealRoomHubContractlRoomContract()")
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
        console.log("_getDealTokenContract()")
        const deal = await this.getDeal(id)
        return ContractFactory.getErc20Contract(deal.erc20, this._signer)
    }

    private async _getDealAssetContract(id: BigNumberish): Promise<Erc721Detailed> {
        console.log("_getDealAssetContract()")
        const deal = await this.getDeal(id)
        return ContractFactory.getErc721Contract(deal.erc721, this._signer)
    }

    private async _getMainMultisigContract(): Promise<MultiSigWallet> {
        console.log("_getMainMultisigContract()")
        if (!this.details) {
            throw new Error(ERROR_ROOM_NOT_LOADED)
        }
        return await ContractFactory.getMultisigContract(this.details.mainMultiSig, this._signer)
    }

    private async _getAgentsMultisigContract(): Promise<MultiSigWallet> {
        console.log("_getAgentsMultisigContract()")
        if (!this.details) {
            throw new Error(ERROR_ROOM_NOT_LOADED)
        }
        return await ContractFactory.getMultisigContract(this.details.agentsMultiSig, this._signer)
    }

    private async _getRoomDetails(): Promise<DealRoomDetails> {
        return this.dealRoomHubContract.getRoom(this._dealRoomAddress)
    }
}
