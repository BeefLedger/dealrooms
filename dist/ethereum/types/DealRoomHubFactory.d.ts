import { ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { TransactionOverrides } from ".";
import { DealRoomHub } from "./DealRoomHub";
export declare class DealRoomHubFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: TransactionOverrides): Promise<DealRoomHub>;
    getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): DealRoomHub;
    connect(signer: Signer): DealRoomHubFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): DealRoomHub;
}
