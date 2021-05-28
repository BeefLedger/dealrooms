import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { TestAsset } from "./TestAsset";
export declare class TestAssetFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<TestAsset>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): TestAsset;
    connect(signer: Signer): TestAssetFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): TestAsset;
}
