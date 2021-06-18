import { BigNumber, BigNumberish, ContractReceipt, Signer } from "ethers"

import { Ierc20 } from "../ethereum/types/Ierc20"
import { DealRoom } from "../ethereum/types/DealRoom"
import { Ierc721 } from "../ethereum/types/Ierc721"
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json"
import * as Deployer from "../ethereum/deploy/deploy"
import { DealRoomHub } from "../ethereum/types/DealRoomHub"
import { MultiSigController, MultiSigTransaction } from "./multiSigController"
import * as ContractFactory from "./chain/prefabContractFactory"

export const ERROR_ROOM_NOT_LOADED = "ROOM_NOT_LOADED"
export const ERROR_NO_AGENT_MULTISIG = "NO_AGENT_MULTISIG"
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

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
    price?: BigNumberish
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
        return Deployer.deployDealRoomHub(signer)
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

    // Make a deal: Fetch or deploy the room contract, then create the deal
    public static async deployRoomAndDeal(roomParams: Deployer.DealRoomBasicCreateParams, deal: Deal, signer: Signer): Promise<{roomAddress: string, dealId: number}> {
        // See if there is already a room for this buyer and seller
        debugger
        let deployedRoom: DealRoomDetails
        const roomAddresses = await DealRoomController.getRooms(roomParams.dealRoomHubAddress, signer)
        for (const roomAddress of roomAddresses) {
            const room = await DealRoomController.getRoomDetails(roomParams.dealRoomHubAddress, roomAddress, signer)
            if (room.seller === roomParams.seller) {
                deployedRoom = room
                break
            }
        }
        // If no pre-existing room, create a room and deal in the same transaction
        if (!deployedRoom) {
            return Deployer.deployRoomAndDeal(roomParams, deal, signer)          
        }

        const roomContract = await ContractFactory.getDealRoomContract(deployedRoom.addr, signer)
        const dealId = await DealRoomController.makeRoomDeal(roomContract, deal, signer)

        return {
            roomAddress: deployedRoom.addr,
            dealId
        }
    }

    public static async deployBasicRoom(params: Deployer.DealRoomBasicCreateParams, signer: Signer): Promise<string> {
        try {
            const dr = await Deployer.deployBasicDealRoom(params, await signer.getAddress(), signer)
            return dr.addr;
        }
        catch (e) {
            throw Error(`_deployDealRoom: ${e}`)
        }
    }



    // Get a list of rooms from a hub
    public static async getRooms(hubAddress: string, signer: Signer, userAddress?: string): Promise<string[]> {
        const hubContract = await ContractFactory.getDealRoomHubContract(hubAddress, signer)
        return hubContract.getUserRooms(userAddress ?? await signer.getAddress())
    }

    public static async getRoomDetails(hubAddress: string, roomAddress: string, signer: Signer): Promise<DealRoomDetails> {
        const hubContract: DealRoomHub = await ContractFactory.getDealRoomHubContract(hubAddress, signer)  
        const result: DealRoomDetails = await hubContract.getRoom(roomAddress)
        return result
    }

    public static async makeRoomDeal(room: DealRoom, deal: Deal, signer: Signer): Promise<number> {
        const dealId = (await room.getDealCount()).toNumber()
        const tx = await room.makeDeal(deal.erc20, deal.erc721, deal.price, deal.assetItems)
        const receipt = await tx.wait()
        return dealId
    }

    //--- Instance methods, for use with a Controller constructed with a specific instance of a Room

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

    public isBasic(): boolean {
        return this.details.agentMultiSig === NULL_ADDRESS
    }

    public async depositDealCoins(id: BigNumberish, amount: BigNumberish): Promise<ContractReceipt> {
        const tokenContract = await this._getDealTokenContract(id)
        const roomContract = await this._getDealRoomContract()
        return (await tokenContract.transfer(roomContract.address, amount)).wait()
    }

    public async depositDealAssets(id: BigNumberish, items: BigNumberish[]): Promise<ContractReceipt[]> {
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

        const buyer = await contract.getBuyer()
        return buyer
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
        const dealRoom = await this._getDealRoomContract()      
        const dealId = await DealRoomController.makeRoomDeal(dealRoom, deal, this._signer)
        console.log("Made deal") 
        const result = await this.getDeal(dealId)
        console.log(`Fetched deal ${JSON.stringify(result)}`)
        return result
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
            const dealMultiSig: MultiSigController = await this._getDealMultiSig();
            const agentMultiSig: MultiSigController = await this._getAgentMultiSig();
            
            // Get deal transaction and confirmations (if any) from main multisig
            const dealTransaction = await this._getDealSettleTransaction(dealId)
            let dealConfirmations: number = 0
            if (dealTransaction) {
                dealConfirmations = (await dealMultiSig.getConfirmations(dealTransaction.hash)).length
            }
            // Get agent transaction and confirmations (if any) from agent multisig
            let agentTransaction: MultiSigTransaction | null = null
            let agentConfirmations: number = 0
            if (this.details.agentMultiSig !== NULL_ADDRESS) {
                if (agentMultiSig) {
                    const agentTransaction = await this._getAgentDealSettleTransaction(dealId) //TODO: Optimise this
                    if (agentTransaction) {
                        agentConfirmations = (await agentMultiSig.getConfirmations(agentTransaction.hash)).length
                    }
                }
            }

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
                    assetId: BigNumber.from(assetId),
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

    public async proposeSettleDeal(dealId: BigNumberish): Promise<string> {
        
        if (!this.isBasic() && [this.details.arbitrator, this.details.buyer, this.details.seller].includes(await this.signerAddress())) {
            return this._proposeAgentsSettleDeal(dealId)
        } else {
            return this._proposeMainSettleDeal(dealId) 
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

    public getAgentMultiSigContractAddress(): string {
        return this.details.agentMultiSig
    }

    public getDealMultiSigContractAddress(): string {
        return this.details.dealMultiSig
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

    private async _getDealTokenContract(id: BigNumberish): Promise<Ierc20> {
        const deal = await this.getDeal(id)
        return ContractFactory.getErc20Contract(deal.erc20, this._signer)
    }

    private async _getDealAssetContract(id: BigNumberish): Promise<Ierc721> {
        const deal = await this.getDeal(id)
        return ContractFactory.getErc721Contract(deal.erc721, this._signer)
    }

    public async _getDealMultiSig(): Promise<MultiSigController> {
        if (!this.details) {
            throw new Error(ERROR_ROOM_NOT_LOADED)
        }
        const msController: MultiSigController = new MultiSigController(this.details.dealMultiSig, this._signer)
        await msController.init()
        return msController
    }

    private async _getAgentMultiSig(): Promise<MultiSigController> {
        if (!this.details) {
            throw new Error(ERROR_ROOM_NOT_LOADED)
        }
        if (!this.details.agentMultiSig) {
            throw new Error(ERROR_NO_AGENT_MULTISIG)
        }
        const msController: MultiSigController = new MultiSigController(this.details.agentMultiSig, this._signer)
        await msController.init()
        return msController
    }

    private async _getRoomDetails(): Promise<DealRoomDetails> {
        return this.dealRoomHubContract.getRoom(this._dealRoomAddress)
    }

    private async _getDealSettleTransaction(dealId: BigNumberish): Promise<MultiSigTransaction | null> {
        let result: MultiSigTransaction = null
        const multiSigContract = await this._getDealMultiSig()
        // Find transaction that corresponds to settle(dealId)
        const transactions = await multiSigContract.getTransactions()
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

    private async _getAgentDealSettleTransaction(dealId: BigNumberish): Promise<MultiSigTransaction | null> {
        let result: MultiSigTransaction = null
        const multiSigContract = await this._getAgentMultiSig()
        const transactions = await multiSigContract.getTransactions()
        if (transactions.length) {
            result = transactions.find((transaction: MultiSigTransaction) => {
                const decodedTransaction = MultiSigController.decodeMultiSigTransaction(transaction.data)
                if (decodedTransaction.name === "submitTransaction") { //TODO: Also check encoded params are "settle", [dealId]
                    return true
                } 
            })
            return result
        } else {
            return null
        }       
    }

    // Send a new transaction to the main multisig to settle the deal
    private async _proposeMainSettleDeal(dealId: BigNumberish): Promise<string> {

        const dealRoomContract: DealRoom = await this.getDealRoomContract()
        const dealMultiSig: MultiSigController = await this._getDealMultiSig();

        const hash = await dealMultiSig.submitMultiSigTransaction(
            dealRoomContract.address,
            DealRoomCompiled.abi,
            "settle",
            [dealId]
        )
        return hash
    }

    // Send a new transaction to the agents multisig to "approve" the deal in the main multisig
    private async _proposeAgentsSettleDeal(dealId: BigNumberish): Promise<string> {

        const deal: Deal = await this.getDeal(dealId)
        const agentMultiSig: MultiSigController = await this._getAgentMultiSig();
        
        //Submit a transaction to approve a transaction
        const roomContract = await this._getDealRoomContract()

        // Make a new agent proposal to approve deal settlement proposal
        const hash = await agentMultiSig.submitDuplexMultiSigProposal(
            this.getDealMultiSigContractAddress(),
            roomContract.address,
            DealRoomCompiled.abi,
            "settle",
            [dealId],
        )
        return hash
    }
}
