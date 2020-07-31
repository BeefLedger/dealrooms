import { DealRoom } from "../types/DealRoom";
import { deployMultisig, deployDealRoom } from "../deploy/deploy";
import { MultiSigWallet } from "../types/MultiSigWallet";
import { Signer, BigNumberish, BigNumber } from "ethers";
import { getDealRoomContract } from "./chain/prefabContractFactory";

export type Deal = {
    id: BigNumber
    erc20: string
    erc721: string
    price: BigNumber
    assetItems: BigNumber[]
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
    constructor(dealRoomParams: string | DealRoomCreateParams, signer: Signer) {
        this._signer = signer
        if (dealRoomParams instanceof String) {
            // Fetch Multisig and/or DealRoom contracts on demand
            this._dealRoomAddress = dealRoomParams as string;
        } else {
            // Deploy Multisig and DealRoom contracts on demand
            this._createParams = dealRoomParams as DealRoomCreateParams
        }
    }
    
    private async _deployMultisig(params: DealRoomCreateParams): Promise<MultiSigWallet> {
        this._multiSig = await deployMultisig([params.buyer, params.seller, params.arbitrator], 2)
        return this._multiSig
    }

    private async _deployDealRoom(params: DealRoomCreateParams): Promise<string> {
        if (this._multiSig === undefined) {
            //Create multisig first
            this._multiSig = await this._deployMultisig(params)
        }
        let contract = await deployDealRoom(params.buyer, params.seller, this._multiSig.address)
        this._dealRoomAddress = contract.address
        return contract.address
    }

    private async _getDealRoomContract(): Promise<DealRoom> {
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
        return getDealRoomContract(this._dealRoomAddress, this._signer)
    }

    public async getDealRoomContract(): Promise<DealRoom> {
        return this._getDealRoomContract()
    }

    public async makeDeal(deal: Deal): Promise<Deal> {
        const contract = await this._getDealRoomContract()
        await contract.makeDeal(deal.id, deal.erc20, deal.erc721, deal.price, deal.assetItems)
        return this.getDeal(deal.id)
    }

    public async getDeal(id: BigNumberish): Promise<Deal> {
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

    public async getDealMissingAssets(id: BigNumberish): Promise<BigNumberish> {
        const contract = await this._getDealRoomContract()
        return contract.missingDealAssets(id);
    }

    public async getDealMissingTokens(id: BigNumberish): Promise<BigNumberish> {
        const contract = await this._getDealRoomContract()
        return contract.missingDealTokens(id);
    }
}