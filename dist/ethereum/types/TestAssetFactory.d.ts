import { ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { TransactionOverrides } from ".";
import { TestAsset } from "./TestAsset";
export declare class TestAssetFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: TransactionOverrides): Promise<TestAsset>;
    getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): TestAsset;
    connect(signer: Signer): TestAssetFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): TestAsset;
}
