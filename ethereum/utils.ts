import { Signer } from "ethers";
import { BigNumberish, parseEther } from "ethers/utils";

export async function sendEth(to: string, amount: BigNumberish, signer: Signer) {
    let transaction = {
        to,
        value: parseEther(amount.toString())
    };
    
    // Send the transaction
    return signer.sendTransaction(transaction);
}
