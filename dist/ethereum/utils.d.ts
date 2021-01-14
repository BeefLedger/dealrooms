import { Signer } from "ethers";
import { BigNumberish } from "ethers/utils";
export declare function sendEth(to: string, amount: BigNumberish, signer: Signer): Promise<import("ethers/providers").TransactionResponse>;
