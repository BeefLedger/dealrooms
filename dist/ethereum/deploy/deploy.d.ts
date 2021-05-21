import { TestCoin } from "../types/TestCoin";
import { TestAsset } from "../types/TestAsset";
import { DealRoomHub } from "../types/DealRoomHub";
import { MultiSigHashed } from "../types/MultiSigHashed";
import { TestContract } from "../types/TestContract";
import { Signer } from "ethers";
import { DealRoomDetails } from "../../services/dealRoomController";
export declare type DeployedEnvironment = {
    DealRoomHub?: DealRoomHub;
    erc20?: TestCoin;
    erc721?: TestAsset;
};
export declare const ERROR_NO_EVENT_FOUND = "NO_EVENT_FOUND";
export declare const ERROR_MULTIPLE_EVENTS = "ERROR_MULTIPLE_EVENTS";
export declare function deployTestCoin(signer: Signer): Promise<TestCoin>;
export declare function deployTestAsset(signer: Signer): Promise<TestAsset>;
export declare function deployTestContract(signer: Signer): Promise<TestContract>;
export declare function deployMultisig(owners: string[], approvalsRequired: number, signer: Signer): Promise<MultiSigHashed>;
export declare function deployDealRoomHub(signer: Signer): Promise<DealRoomHub>;
export declare type DealRoomCreateParams = {
    dealRoomHubAddress: string;
    buyer: string;
    seller: string;
    arbitrator: string;
    docApprover: string;
    sensorApprover: string;
};
export declare type DealRoomBasicCreateParams = {
    dealRoomHubAddress: string;
    buyer: string;
    seller: string;
};
export declare function deployDealRoom(params: DealRoomCreateParams, owner: string, signer: Signer): Promise<DealRoomDetails>;
export declare function deployBasicDealRoom(params: DealRoomBasicCreateParams, owner: string, signer: Signer): Promise<DealRoomDetails>;
export declare function deployAll(signer: Signer): Promise<DeployedEnvironment>;
