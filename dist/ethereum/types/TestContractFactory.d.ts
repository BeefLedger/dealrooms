import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { TestContract } from "./TestContract";
export declare class TestContractFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<TestContract>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): TestContract;
    connect(signer: Signer): TestContractFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): TestContract;
}
