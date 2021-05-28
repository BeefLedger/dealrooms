import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { Erc20 } from "./Erc20";
export declare class Erc20Factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(name_: string, symbol_: string, overrides?: Overrides): Promise<Erc20>;
    getDeployTransaction(name_: string, symbol_: string, overrides?: Overrides): TransactionRequest;
    attach(address: string): Erc20;
    connect(signer: Signer): Erc20Factory;
    static connect(address: string, signerOrProvider: Signer | Provider): Erc20;
}
