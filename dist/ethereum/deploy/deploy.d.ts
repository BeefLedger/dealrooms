import { TestCoin } from "../types/TestCoin";
import { TestAsset } from "../types/TestAsset";
import { DealHub } from "../types/DealHub";
import { MultiSigHashed } from "../types/MultiSigHashed";
import { TestContract } from "../types/TestContract";
import { BigNumberish, Signer } from "ethers";
export declare type DeployedEnvironment = {
    DealHub?: DealHub;
    erc20?: TestCoin;
    erc721?: TestAsset;
};
export declare type DeployDealParams = {
    dealHubAddress: string;
    buyer: string;
    seller: string;
    erc20: string;
    erc721: string;
    price: BigNumberish;
    assetItems: BigNumberish[];
};
export declare const ERROR_NO_EVENT_FOUND = "NO_EVENT_FOUND";
export declare const ERROR_MULTIPLE_EVENTS = "ERROR_MULTIPLE_EVENTS";
export declare function deployTestCoin(signer: Signer): Promise<TestCoin>;
export declare function deployTestAsset(signer: Signer): Promise<TestAsset>;
export declare function deployTestContract(signer: Signer): Promise<TestContract>;
export declare function deployMultisig(owners: string[], approvalsRequired: number, signer: Signer): Promise<MultiSigHashed>;
export declare function deployDealHub(signer: Signer): Promise<DealHub>;
export declare function deployDeal(params: DeployDealParams, owner: string, signer: Signer): Promise<string>;
export declare function deployAll(signer: Signer): Promise<DeployedEnvironment>;
