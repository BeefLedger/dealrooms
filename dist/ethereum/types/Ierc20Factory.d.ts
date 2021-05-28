import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Ierc20 } from "./Ierc20";
export declare class Ierc20Factory {
    static connect(address: string, signerOrProvider: Signer | Provider): Ierc20;
}
