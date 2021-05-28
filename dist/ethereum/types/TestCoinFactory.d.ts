import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { TestCoin } from "./TestCoin";
export declare class TestCoinFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<TestCoin>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): TestCoin;
    connect(signer: Signer): TestCoinFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): TestCoin;
}
