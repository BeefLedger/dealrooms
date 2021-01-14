import { ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { BigNumberish } from "ethers/utils";
import { TransactionOverrides } from ".";
import { MultiSigHashed } from "./MultiSigHashed";
export declare class MultiSigHashedFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(_owners: string[], _required: BigNumberish, overrides?: TransactionOverrides): Promise<MultiSigHashed>;
    getDeployTransaction(_owners: string[], _required: BigNumberish, overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): MultiSigHashed;
    connect(signer: Signer): MultiSigHashedFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): MultiSigHashed;
}
