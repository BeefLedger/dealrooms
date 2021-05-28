import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { MultiSigHashed } from "./MultiSigHashed";
export declare class MultiSigHashedFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(_owners: string[], _required: BigNumberish, overrides?: Overrides): Promise<MultiSigHashed>;
    getDeployTransaction(_owners: string[], _required: BigNumberish, overrides?: Overrides): TransactionRequest;
    attach(address: string): MultiSigHashed;
    connect(signer: Signer): MultiSigHashedFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): MultiSigHashed;
}
