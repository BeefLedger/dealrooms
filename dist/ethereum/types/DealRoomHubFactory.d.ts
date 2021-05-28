import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { DealRoomHub } from "./DealRoomHub";
export declare class DealRoomHubFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<DealRoomHub>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): DealRoomHub;
    connect(signer: Signer): DealRoomHubFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): DealRoomHub;
}
