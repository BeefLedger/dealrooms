import { ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { TransactionOverrides } from ".";
import { TestCoin } from "./TestCoin";
export declare class TestCoinFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: TransactionOverrides): Promise<TestCoin>;
    getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): TestCoin;
    connect(signer: Signer): TestCoinFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): TestCoin;
}
