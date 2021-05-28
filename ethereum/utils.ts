import { parseEther } from "@ethersproject/units";
import { BigNumberish, Signer } from "ethers";

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

export async function sendEth(to: string, amount: BigNumberish, signer: Signer) {
    console.log(`Sending ETH to ${to}`)
    let transaction = {
        to,
        value: parseEther(amount.toString())
    };
    
    // Send the transaction
    return signer.sendTransaction(transaction);
}