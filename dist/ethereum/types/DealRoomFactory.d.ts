import { ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { TransactionOverrides } from ".";
import { DealRoom } from "./DealRoom";
export declare class DealRoomFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(_buyer: string, _seller: string, overrides?: TransactionOverrides): Promise<DealRoom>;
    getDeployTransaction(_buyer: string, _seller: string, overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): DealRoom;
    connect(signer: Signer): DealRoomFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): DealRoom;
}
