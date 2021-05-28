import { BigNumberish, Signer } from "ethers";
export declare const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare function sendEth(to: string, amount: BigNumberish, signer: Signer): Promise<import("@ethersproject/abstract-provider").TransactionResponse>;
