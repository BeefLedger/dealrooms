import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import { DealRoom } from "./DealRoom";
export declare class DealRoomFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(_buyer: string, _seller: string, overrides?: Overrides): Promise<DealRoom>;
    getDeployTransaction(_buyer: string, _seller: string, overrides?: Overrides): TransactionRequest;
    attach(address: string): DealRoom;
    connect(signer: Signer): DealRoomFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): DealRoom;
}
