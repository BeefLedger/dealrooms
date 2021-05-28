import { BigNumber, BigNumberish, ContractReceipt, Signer } from "ethers";
import { DealRoom } from "../ethereum/types/DealRoom";
import * as Deployer from "../ethereum/deploy/deploy";
import { DealRoomHub } from "../ethereum/types/DealRoomHub";
import { MultiSigController, MultiSigTransaction } from "./multiSigController";
export declare const ERROR_ROOM_NOT_LOADED = "ROOM_NOT_LOADED";
export declare const ERROR_NO_AGENT_MULTISIG = "NO_AGENT_MULTISIG";
export declare const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare type DealRoomDetails = {
    addr: string;
    buyer: string;
    seller: string;
    arbitrator: string;
    docApprover: string;
    sensorApprover: string;
    dealMultiSig: string;
    agentMultiSig: string;
};
export declare type Deal = {
    id?: BigNumberish;
    erc20?: string;
    erc721?: string;
    price?: BigNumber;
    assetItems?: BigNumberish[];
    agentConfirmations?: number;
    dealConfirmations?: number;
    dealTransaction?: MultiSigTransaction;
    agentTransaction?: MultiSigTransaction;
    status?: number;
};
export declare type AssetStatus = {
    assetId: BigNumber;
    owner: string;
};
export declare const DealStatus: {
    Unknown: number;
    Open: number;
    Cancelled: number;
    Settled: number;
};
export declare class DealRoomController {
    private _signer;
    private _dealRoomAddress?;
    private _dealRoomHubAddress?;
    dealRoomContract?: DealRoom;
    dealRoomHubContract?: DealRoomHub;
    details?: DealRoomDetails;
    static deployHub(signer: Signer): Promise<DealRoomHub>;
    static deployRoom(params: Deployer.DealRoomCreateParams, signer: Signer): Promise<string>;
    static deployBasicRoom(params: Deployer.DealRoomBasicCreateParams, signer: Signer): Promise<string>;
    static getRooms(hubAddress: string, signer: Signer): Promise<string[]>;
    constructor(hubAddress: string, dealRoomAddress: string, signer: Signer);
    init(): Promise<void>;
    isBasic(): boolean;
    depositDealCoins(id: BigNumberish, amount: BigNumberish): Promise<ContractReceipt>;
    depositDealAssets(id: BigNumberish, items: BigNumberish[]): Promise<ContractReceipt[]>;
    getMyTokenBalance(id: BigNumberish): Promise<BigNumberish>;
    getMyAssetBalance(id: BigNumberish): Promise<BigNumberish>;
    getAssetOwner(dealId: BigNumberish, assetId: BigNumberish): Promise<string>;
    getDealRoomContract(): Promise<DealRoom>;
    getBuyer(): Promise<string>;
    getSeller(): Promise<string>;
    getAddress(): Promise<string>;
    makeDeal(deal: Deal): Promise<Deal>;
    getDeal(dealId: BigNumberish): Promise<Deal>;
    getDealCount(): Promise<number>;
    getDeals(): Promise<Deal[]>;
    getDealMissingAssets(id: BigNumberish): Promise<number>;
    getDealAssetStatus(dealId: BigNumberish): Promise<AssetStatus[]>;
    getDealMissingCoins(id: BigNumberish): Promise<number>;
    proposeSettleDeal(dealId: BigNumberish): Promise<string>;
    withdrawDealCoins(dealId: BigNumberish): Promise<ContractReceipt>;
    withdrawDealAssets(dealId: BigNumberish): Promise<ContractReceipt>;
    getAgentMultiSigContractAddress(): string;
    getDealMultiSigContractAddress(): string;
    private signerAddress;
    private _getDealRoomContract;
    private _getDealRoomHubContract;
    private _getDealTokenContract;
    private _getDealAssetContract;
    _getDealMultiSig(): Promise<MultiSigController>;
    private _getAgentMultiSig;
    private _getRoomDetails;
    private _getDealSettleTransaction;
    private _getAgentDealSettleTransaction;
    private _proposeMainSettleDeal;
    private _proposeAgentsSettleDeal;
}
