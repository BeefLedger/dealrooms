import { BigNumber, BigNumberish, Signer } from "ethers";
import { IERC20 } from "../ethereum/types/IERC20";
import { Deal as DealContract } from "../ethereum/types/Deal";
import { IERC721 } from "../ethereum/types/IERC721";
import * as Deployer from "../ethereum/deploy/deploy";
import { DealHub } from "../ethereum/types/DealHub";
import { MultiSigTransaction } from "./multiSigController";
export declare const ERROR_DEAL_NOT_LOADED = "DEAL_NOT_LOADED";
export declare const ERROR_NO_MULTISIG = "NO_MULTISIG";
export declare const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare type DealListing = {
    addr: string;
    buyer: string;
    seller: string;
    dealMultiSig: string;
};
export declare type Deal = {
    addr?: string;
    buyer: string;
    seller: string;
    erc20?: string;
    erc721?: string;
    price?: BigNumberish;
    assetItems?: BigNumberish[];
    multisigConfirmations?: number;
    multisigTransaction?: MultiSigTransaction;
    status?: number;
};
export declare type AssetStatus = {
    assetId: BigNumber;
    owner: string;
};
export declare const DealStatus: {
    Open: number;
    Canceled: number;
    Settled: number;
};
export declare class DealController {
    private _signer;
    private _dealAddress?;
    private _dealHubAddress?;
    deal: Deal;
    dealContract?: DealContract;
    dealHubContract?: DealHub;
    dealListing?: DealListing;
    dealAssetContract?: IERC721;
    dealCoinContract?: IERC20;
    static deployHub(signer: Signer): Promise<DealHub>;
    static deployDeal(params: Deployer.DeployDealParams, signer: Signer): Promise<string>;
    static getUserDeals(hubAddress: string, signer: Signer, userAddress?: string): Promise<string[]>;
    static getDealListing(hubAddress: string, dealAddress: string, signer: Signer): Promise<DealListing>;
    static makeDeal(hub: DealHub, deal: Deal, signer: Signer): Promise<string>;
    constructor(hubAddress: string, signer: Signer);
    initWithDeal(dealAddress: string): Promise<void>;
    initWithNewDeal(deal: Deal): Promise<void>;
    private init;
}
