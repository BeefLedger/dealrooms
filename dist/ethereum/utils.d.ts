import { Signer } from "ethers";
import { BigNumberish } from "ethers/utils";
export declare const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare function sendEth(to: string, amount: BigNumberish, signer: Signer): Promise<import("ethers/providers").TransactionResponse>;
