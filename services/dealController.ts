import { BigNumber, BigNumberish, ContractReceipt, Signer } from "ethers"

import { IERC20 } from "../ethereum/types/IERC20"
import { Deal as DealContract } from "../ethereum/types/Deal"
import { IERC721 } from "../ethereum/types/IERC721"
import * as DealCompiled from "../ethereum/abi/Deal.json"
import * as Deployer from "../ethereum/deploy/deploy"
import { DealHub } from "../ethereum/types/DealHub"
import { MultiSigController, MultiSigTransaction } from "./multiSigController"
import * as ContractFactory from "./chain/prefabContractFactory"

export const ERROR_DEAL_NOT_LOADED = "DEAL_NOT_LOADED"
export const ERROR_NO_MULTISIG = "NO_MULTISIG"
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

export type DealListing = {
    addr: string
    buyer: string
    seller: string
    erc20: string
    erc721: string
    price: BigNumberish
    assetItems: BigNumberish[]
    dealMultiSig: string
    agentMultiSig: string
}

export type Deal = {
    addr?: string
    buyer: string
    seller: string
    arbitrator?: string
    sensor?: string
    docApprover?: string
    erc20?: string
    erc721?: string
    price?: BigNumberish
    assetItems?: BigNumberish[]
    multisigConfirmations?: number
    multisigTransaction?: MultiSigTransaction
    status?: number
}


export type AssetStatus = {
    assetId: BigNumber,
    owner: string
}

export const DealStatus = {
    Open: 0,
    Canceled: 1,
    Settled: 2       
}

export class DealController {
    private _signer: Signer
    private _dealAddress?: string
    private _dealHubAddress?: string
    public deal: Deal
    public dealContract?: DealContract
    public dealHubContract?: DealHub
    public dealListing?: DealListing
    public dealAssetContract?: IERC721
    public dealCoinContract?: IERC20

    //--- Public methods ------------------------------------- //

    //--- Static methods

    // Deploy a hub contract
    public static async deployHub(signer: Signer): Promise<DealHub> {
        return Deployer.deployDealHub(signer)
    }

    // Deploy a deal contract
    public static async deployDeal(params: Deployer.DeployDealParams, signer: Signer): Promise<string> {
        try {
            return Deployer.deployDeal(params, await signer.getAddress(), signer)
        }
        catch (e) {
            throw Error(`_deployDealRoom: ${e}`)
        }
    }

    // Get a list of deals from a hub
    public static async getUserDeals(hubAddress: string, signer: Signer, userAddress?: string): Promise<string[]> {
        const hubContract = await ContractFactory.getDealHubContract(hubAddress, signer)
        return hubContract.getUserDeals(userAddress ?? await signer.getAddress())
    }

    public static async getDealListing(hubAddress: string, dealAddress: string, signer: Signer): Promise<DealListing> {
        const hubContract: DealHub = await ContractFactory.getDealHubContract(hubAddress, signer)  
        const result: DealListing = await hubContract.getDeal(dealAddress)
        return result
    }

    public static async makeDeal(hub: DealHub, deal: Deal, signer: Signer): Promise<string> {
        const params: Deployer.DeployDealParams = {
            dealHubAddress: hub.address,
            buyer: deal.buyer,
            seller: deal.seller,
            arbitrator: deal.arbitrator,
            sensor: deal.sensor,
            docApprover: deal.docApprover,
            erc20: deal.erc20,
            erc721: deal.erc721,
            price: deal.price,
            assetItems: deal.assetItems
        }
        return Deployer.deployDeal(params, await signer.getAddress(), signer)
    }

    /*
    public static async fetchDeal(dealHub: string, dealAddress: string, signer: Signer): Promise<Deal> {
        
        try {
            const hubContract: DealHub = await ContractFactory.getDealHubContract(dealHub, signer)
            const dealContract = await ContractFactory.getDealContract(dealAddress, signer)
            let dealStruct: any
            try {
                dealStruct = await dealContract.getDeal()       
            } catch (e) {
                throw new Error(`Deal not found: ${e}`)
            }
            const dealListing: DealListing = await hubContract.getDeal(dealAddress)

            
            // Get multisig from hub    
            const dealMultiSig: MultiSigController = new MultiSigController(dealListing.dealMultiSig, signer)
            await dealMultiSig.init()
    
            
            // Get deal transaction and confirmations (if any) from main multisig
            const dealTransaction = await DealController.getDealSettleTransaction(dealMultiSig)
            let multisigConfirmations: number = 0
            if (dealTransaction) {
                multisigConfirmations = (await dealMultiSig.getConfirmations(dealTransaction.hash)).length
            }

            // Return the Deal
            return {
                addr: dealAddress,
                buyer: dealStruct.buyer,
                seller: dealStruct.seller,
                arbitrator: dealStruct.arbitrator,
                sensor: dealStruct.sensor,
                docApprover: dealStruct.docApprover,
                erc20: dealStruct.erc20,
                erc721: dealStruct.erc721,
                price: dealStruct.price,
                assetItems: dealStruct.assetItems.map(item=>item.toNumber()),
                dealTransaction,
                multisigConfirmations,
                status: dealStruct.status,
            } as Deal
        }
        catch (e) {
            throw new Error(`Failed to find deal: ${e}`)
        }      
    }*/

    private static async _getDealContract(dealAddress: string, signer: Signer): Promise<DealContract> {
        try {
            //Connect to the contract with my signer
            const contract = await ContractFactory.getDealContract(dealAddress, signer)
            return contract
        }
        catch (e) {
            throw Error(`Failed to get DealRoom contract: ${e}`)
        }
    }

    private static async getDealSettleTransaction(multiSigController: MultiSigController): Promise<MultiSigTransaction | null> {
        // Find transaction that corresponds to settle(dealId)
        let result: MultiSigTransaction = null
        const transactions = await multiSigController.getTransactions()
        if (transactions.length) {
            result = transactions.find((transaction: MultiSigTransaction) => {
                const decodedTransaction = MultiSigController.decodeDealRoomTransaction(transaction.data)
                if (decodedTransaction.name === "settle") 
                return true
            })        
            return result ?? null
        } else {
            return null
        }  
    }

    //--- Instance methods, for use with a Controller constructed with a specific instance of a Room

    constructor(hubAddress: string, signer: Signer) {
        this._signer = signer
        this._dealHubAddress = hubAddress
    }

    //Load a pre-existing deal and initialise
    public async initWithDeal(dealAddress: string): Promise<void> {
        if (!this.dealHubContract) {
            this.dealHubContract = await ContractFactory.getDealHubContract(this._dealHubAddress, this._signer)
        }
        this.dealContract = await DealController._getDealContract(dealAddress, this._signer)
        this._dealAddress = dealAddress
        //this.dealContract = await ContractFactory.getDealContract(dealAddress, this._signer)
        this.dealListing = await this._getDealListing()
        this.deal = await this.getDeal() // DealController.getDeal(this._dealHubAddress, dealAddress, this._signer)
        this.dealContract = await DealController._getDealContract(dealAddress, this._signer)
        this.dealHubContract = await this._getDealHubContract();
        
        this.dealAssetContract = await this._getDealAssetContract()
        this.dealCoinContract = await this._getDealCoinContract()

    }

    //Create a new deal and initialise
    public async initWithNewDeal(deal: Deal): Promise<void> 
    {

        this.dealHubContract = await ContractFactory.getDealHubContract(this._dealHubAddress, this._signer)
        this._dealAddress = await DealController.makeDeal(this.dealHubContract, deal, this._signer)
        return this.initWithDeal(this._dealAddress)
    }

    public async depositDealCoins(amount: BigNumberish): Promise<ContractReceipt> {
        return (await this.dealCoinContract.transfer(this.dealContract.address, amount)).wait()
    }

    public async depositDealAssets(items: BigNumberish[]): Promise<ContractReceipt[]> {

        const receipts: ContractReceipt[] = []
        for (const item of items) {
            receipts.push(await (await this.dealAssetContract.transferFrom(await this._signer.getAddress(), this.dealContract.address, item)).wait())
        }
        return receipts  
    }

    public async getMyCoinBalance(): Promise<BigNumberish> {
        const addr = await this._signer.getAddress()
        console.log(`Getting balance for ${addr}`)
        return this.dealCoinContract.balanceOf(addr)
    }

    public async getMyAssetBalance(id: BigNumberish): Promise<BigNumberish> {
        return this.dealAssetContract.balanceOf(await this._signer.getAddress())
    }

    public async getAssetOwner(assetId: BigNumberish): Promise<string> {
        return this.dealAssetContract.ownerOf(assetId)
    }

    public getDealContract(): DealContract {
        return this.dealContract;
    }

    public async getBuyer(): Promise<string> {
        return await this.dealContract.getBuyer()
    }

    public async getSeller(): Promise<string> {
        return await this.dealContract.getSeller()
    }

    public isAdvancedDeal(): boolean {
        return this.deal.arbitrator !== "0x0000000000000000000000000000000000000000"
    }
    
    public async getDeal(): Promise<Deal> {
        if (!this.dealContract) {
            this.dealContract = await DealController._getDealContract(this._dealAddress, this._signer)
        }
        try {
            let dealListing: any
            try {
                const dealStruct = await this.dealHubContract.getDeal(this._dealAddress)// await this.dealContract.getDeal()   
                const deal = await this.dealContract.getDeal()
                dealListing = { ...dealStruct, status: deal.status }
            } catch (e) {
                throw new Error(`Deal not found: ${e}`)
            }
            
            // Get multisig from Room
            const dealMultiSig: MultiSigController = await this._getDealMultiSig();
            
            // Get deal transaction and confirmations (if any) from main multisig
            const dealTransaction = await this._getDealSettleTransaction()
            let multisigConfirmations: number = 0
            if (dealTransaction) {
                multisigConfirmations = (await dealMultiSig.getConfirmations(dealTransaction.hash)).length
            }
            
            // Return the Deal
            return {
                addr: this._dealAddress,
                buyer: dealListing.buyer,
                seller: dealListing.seller,
                arbitrator: dealListing.arbitrator,
                sensor: dealListing.sensor,
                docApprover: dealListing.documentApprover,
                erc20: dealListing.erc20,
                erc721: dealListing.erc721,
                price: dealListing.price,
                assetItems: dealListing.assetItems.map(item=>item.toNumber()),
                dealTransaction,
                multisigConfirmations,
                status: dealListing.status,
            } as Deal
        }
        catch (e) {
            throw new Error(`Failed to find deal: ${e}`)
        }
    }

    public async getDealMissingAssets(): Promise<number> {
        const contract = await this.dealContract
        return (await contract.missingDealAssets()).toNumber()
    }

    public async getDealAssetStatus(): Promise<AssetStatus[]> {
        const results: AssetStatus[] = []
        for (const assetId of this.deal.assetItems) {
            try {
                const owner = await this.getAssetOwner(assetId)
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

    public async getDealMissingCoins(): Promise<BigNumberish> {
        return (await this.dealContract.missingDealCoins())
    }

    public async proposeSettleDeal(): Promise<string> {
        // If this is an advanced deal,
        if (this.isAdvancedDeal()) {
            const _signerAddress = await this.signerAddress()
            if ([this.deal.buyer, this.deal.seller, this.deal.arbitrator].includes(_signerAddress)) {
                console.log("Proposing settlement of agent multisig")
                return this._proposeAgentSettleDeal()
            } else {
                console.log("Proposing settlement of deal multisig")
                return this._proposeMainSettleDeal()
            }
        }
        else {
            console.log("Proposing settlement of simple deal multisig")
            return this._proposeMainSettleDeal()
        }
    }

    public async withdrawDealCoins(): Promise<ContractReceipt> {
        const transaction = await this.dealContract.withdrawDealCoins()
        const receipt = await transaction.wait() 
        return receipt      
    }

    public async withdrawDealAssets(): Promise<ContractReceipt> {
        //const contract = await this._getDealRoomContract()
        //const deal = await this.getDeal(dealId)
        const transaction = await this.dealContract.withdrawDealAssets(this.deal.assetItems.length)
        const receipt = await transaction.wait() 
        return receipt      
    }

    /*public getAgentMultiSigContractAddress(): string {
        return this.details.agentMultiSig
    }*/

    /*public async getDeals(): Promise<Deal[]> {
        try {
            const contract = await this._getDealHubContract()
            const dealAddresses: string[] = await contract.getUserDeals(await this._signer.getAddress())

            const result: Deal[] = []
            for(const dealAddress of dealAddresses) {
                result.push(await this.getDeal(dealAddress))
            }
            return result
        }
        catch (e) {
            throw Error(`getDeals(): ${e}`)
        }
    }*/

    public getDealMultiSigContractAddress(): string {
        return this.dealListing.dealMultiSig
    }

    //--- Private methods ------------------------------------- //

    private async signerAddress(): Promise<string> {
        return this._signer.getAddress();
    }

    private async _getDealHubContract(): Promise<DealHub> {
        try {
            //If the contract hasn't been instantiated yet,
            if (this._dealHubAddress == undefined) {
                throw Error("Deal Hub not yet created")
            }
            //Connect to the contract with my signer
            const contract = await ContractFactory.getDealHubContract(this._dealHubAddress, this._signer)
            return contract
        }
        catch (e) {
            throw Error(`Failed to get Deal Hub contract: ${e}`)
        }

    }

    private async _getDealCoinContract(): Promise<IERC20> {
        return ContractFactory.getErc20Contract(this.deal.erc20, this._signer)
    }

    private async _getDealAssetContract(): Promise<IERC721> {
        return ContractFactory.getErc721Contract(this.deal.erc721, this._signer)
    }

    public async _getDealMultiSig(): Promise<MultiSigController> {
        if (!this.dealListing) {
            throw new Error(ERROR_DEAL_NOT_LOADED)
        }
        const msController: MultiSigController = new MultiSigController(this.dealListing.dealMultiSig, this._signer)
        await msController.init()
        return msController
    }

    private async _getAgentMultiSig(): Promise<MultiSigController> {
        if (!this.dealListing) {
            throw new Error(ERROR_DEAL_NOT_LOADED)
        }

        const msController: MultiSigController = new MultiSigController(this.dealListing.agentMultiSig, this._signer)
        await msController.init()
        return msController
    }

    private async _getDealListing(): Promise<DealListing> {
        return this.dealHubContract.getDeal(this._dealAddress)
    }

    private async _getDealSettleTransaction(): Promise<MultiSigTransaction | null> {
        let result: MultiSigTransaction = null
        const multiSigContract = await this._getDealMultiSig()
        return DealController.getDealSettleTransaction(multiSigContract)
    }

    /*private async _getAgentDealSettleTransaction(dealId: BigNumberish): Promise<MultiSigTransaction | null> {
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
    }*/

    // Send a new transaction to the deal multisig to settle the deal
    private async _proposeMainSettleDeal(): Promise<string> {

        const dealContract: DealContract = await this.getDealContract()
        const dealMultiSig: MultiSigController = await this._getDealMultiSig();

        const hash = await dealMultiSig.submitMultiSigTransaction(
            dealContract.address,
            DealCompiled.abi,
            "settle",
            []
        )
        console.log(`Settle transaction hash is ${hash}`)
        return hash
    }

    // Send a new transaction to the agents multisig to "approve" the deal in the main multisig
    private async _proposeAgentSettleDeal(): Promise<string> {

        //Submit a transaction to approve a transaction
        const dealContract: DealContract = await this.getDealContract()
        const agentMultiSig: MultiSigController = await this._getAgentMultiSig();

        // Make a new agent proposal to approve deal settlement proposal
        const hash = await agentMultiSig.submitDuplexMultiSigProposal(
            this.getDealMultiSigContractAddress(),
            dealContract.address,
            DealCompiled.abi,
            "settle",
            [],
        )
        return hash
    }
}
