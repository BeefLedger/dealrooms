var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parseEther } from "ethers/utils";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export function sendEth(to, amount, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Sending ETH to ${to}`);
        let transaction = {
            to,
            value: parseEther(amount.toString())
        };
        // Send the transaction
        return signer.sendTransaction(transaction);
    });
}
