import { ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { TransactionOverrides } from ".";
import { TestContract } from "./TestContract";
export declare class TestContractFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: TransactionOverrides): Promise<TestContract>;
    getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): TestContract;
    connect(signer: Signer): TestContractFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): TestContract;
}
