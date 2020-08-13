import * as deployer from "../deploy/deploy";
import { MultiSigWallet } from "../types/MultiSigWallet";
import { Signer, BigNumberish, BigNumber, ContractTransaction, ContractReceipt, Event } from "ethers";
import * as prefabContracts from "./chain/prefabContractFactory";
import { Erc20Detailed } from "../types/Erc20Detailed";
import { DealRoom } from "../types/DealRoom";
import { Erc721Detailed } from "../types/Erc721Detailed";

export type Deal = {
    id: BigNumber
    erc20: string
    erc721: string
    price: BigNumber
    assetItems: BigNumber[]
    multisigTransactionId: BigNumber
    status?: number
}

export type DealRoomCreateParams = {
    buyer: string,
    seller: string,
    arbitrator: string,
}
export class DealRoomController {
    private _signer: Signer
    private _dealRoomAddress?: string
    private _createParams?: DealRoomCreateParams
    private _multiSig?: MultiSigWallet
    constructor(dealRoomParams: String | DealRoomCreateParams, signer: Signer) {
        console.log("constructor()")
        this._signer = signer

        if (typeof(dealRoomParams) === "string") {
            // Fetch Multisig and/or DealRoom contracts on demand
            this._dealRoomAddress = dealRoomParams as string;

        } else {
            // Deploy Multisig and DealRoom contracts on demand
            this._createParams = dealRoomParams as DealRoomCreateParams
        }
    }

    //--- Public methods ------------------------------------- //

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

    public async getDealRoomContract(): Promise<DealRoom> {
        return this._getDealRoomContract()
    }

    public async getBuyer(): Promise<string> {
        const contract: DealRoom = await this._getDealRoomContract()
        return contract.buyer
    }

    public async getSeller(): Promise<string> {
        const contract: DealRoom = await this._getDealRoomContract()
        return contract.seller
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
        const contract = await this._getDealRoomContract()
        const tx = await contract.makeDeal(deal.id, deal.erc20, deal.erc721, deal.price, deal.assetItems)
        const receipt = await tx.wait()
        console.log(`makeDeal result`, JSON.stringify(receipt, undefined, 4))
        const multisig = await this._getMultisigContract()

        return this.getDeal(deal.id)
    }

    public async getDeal(id: BigNumberish): Promise<Deal> {
        try {
            const contract = await this._getDealRoomContract()
            const response = await contract.getDeal(id)
            return {
                id: response.id,
                erc20: response.erc20,
                erc721: response.erc721,
                price: response.price,
                assetItems: response.assetItems,
                status: response.status,
            } as Deal
        }
        catch (e) {
            console.error(e)
            throw Error(`getDeal(): ${e}`)
        }

    }

    public async getDealMissingAssets(id: BigNumberish): Promise<BigNumberish> {
        const contract = await this._getDealRoomContract()
        return contract.missingDealAssets(id);
    }

    public async getDealMissingTokens(id: BigNumberish): Promise<BigNumberish> {
        const contract = await this._getDealRoomContract()
        return contract.missingDealTokens(id);
    }

    public async proposeSettleDeal(id: BigNumberish): Promise<BigNumberish> {
        //this._multiSig?.confirmTransaction()
        const deal: Deal = await this.getDeal(id)

        const dealRoomContract = await this.getDealRoomContract()
        const multisigContract = await this._getMultisigContract()
        const owners = await multisigContract.getOwners()
        console.log("owners", JSON.stringify(owners, undefined, 4))

        //Make the transaction  
        const encodedData = dealRoomContract.interface.encodeFunctionData("settle", [deal.id])
        const transaction = await multisigContract.submitTransaction(dealRoomContract.address, 0, encodedData)
        const receipt = await transaction.wait() 
        
        //Obtain the transaction ID created in the multisig
        try {
            if (receipt.events) {
                const submissionEvents = receipt.events?.filter(evt => evt.event === 'Submission')
                if (submissionEvents) { 
                    if (submissionEvents.length > 0) {
                        if (submissionEvents.length === 1) {
                            const transactionId: BigNumberish = submissionEvents[0]?.args?.transactionId
                            return transactionId
                        }
                        throw `More than one submission event`
                    }
                } 
            }
            throw `No submission events`         
        }
        catch (e) {
            throw `Error getting new transaction ID: ${e}`
        }
        
    }

    public async approveSettlementProposal(transactionId: BigNumberish): Promise<ContractReceipt> {
        const multisigContract = await this._getMultisigContract()

        const transaction = await multisigContract.confirmTransaction(transactionId)
        const receipt = await transaction.wait() 
        return receipt
    }

    public async settleDeal(transactionId: BigNumberish): Promise<Event> {
        const multisigContract = await this._getMultisigContract()
        const transaction = await multisigContract.executeTransaction(transactionId)
        const receipt = await transaction.wait() 
        if (receipt.events) {
            const failureEvents = receipt.events.filter(evt=>evt.event === 'ExecutionFailure')
            const successEvents = receipt.events.filter(evt=>evt.event === 'Execution')

            if (failureEvents && failureEvents.length > 0) {
                console.log(`Deal settlement failed:\n${JSON.stringify(failureEvents[0], undefined, 4)}`)
                throw `Deal settlement failed`
            }
            if (successEvents && successEvents.length > 0) {
                return successEvents[0]
            }
            
        }
        throw `Deal settlement failed`
    }

    /*
    public async settleDeal(id: BigNumberish): Promise<ContractReceipt> {

    }
    */
    //--- Private methods ------------------------------------- //

    private async _deployMultiSig(params: DealRoomCreateParams): Promise<MultiSigWallet> {
        // console.log("_deployMultiSig()")
        try {
            this._multiSig = await deployer.deployMultisig([params.buyer, params.seller, params.arbitrator], 2)

            return this._multiSig  
        } catch (e) {
            throw Error(`_deployMultisig(): ${e}`)
        }
    }

    private async _deployDealRoom(params: DealRoomCreateParams): Promise<string> {
        try {
            // console.log("_deployDealRoom()")
            if (this._multiSig === undefined) {
                //Create multisig first
                this._multiSig = await this._deployMultiSig(params)
            }
            let contract = await deployer.deployDealRoom(params.buyer, params.seller, this._multiSig.address)
            this._dealRoomAddress = contract.address
            return contract.address
        }
        catch (e) {
            throw Error(`_deployDealRoom: ${e}`)
        }

    }

    private async _getDealRoomContract(): Promise<DealRoom> {
        try {
            // console.log("_getDealRoomContract()")
            //If the contract hasn't been instantiated yet,
            if (this._dealRoomAddress == undefined) {
                //If the contract needs to be created, create it
                if (this._createParams !== undefined) {
                    this._dealRoomAddress = await this._deployDealRoom(this._createParams)
                } else {
                    throw Error("Cannot obtain DealRoom contract because there were no details provided")
                }
            }
            //Connect to the contract with my signer
            const contract = await prefabContracts.getDealRoomContract(this._dealRoomAddress, this._signer)
            return contract
        }
        catch (e) {
            throw Error(`Failed to get DealRoom contract: ${e}`)
        }

    }

    private async _getDealTokenContract(id: BigNumberish): Promise<Erc20Detailed> {
        // console.log("_getDealTokenContract()")
        const deal = await this.getDeal(id)
        return prefabContracts.getErc20Contract(deal.erc20, this._signer)
    }

    private async _getDealAssetContract(id: BigNumberish): Promise<Erc721Detailed> {
        // console.log("_getDealAssetContract()")
        const deal = await this.getDeal(id)
        return prefabContracts.getErc721Contract(deal.erc721, this._signer)
    }

    private async _getMultisigContract(): Promise<MultiSigWallet> {
        // console.log("_getMultisigContract()")
        if (!this._multiSig) {
            // The owner of the DealRoom contract is the multisig contract
            const drContract = await this._getDealRoomContract()
            const msAddress = await drContract.getOwner();
            this._multiSig = await prefabContracts.getMultisigContract(msAddress, this._signer)

        } 
        return this._multiSig
    }
}