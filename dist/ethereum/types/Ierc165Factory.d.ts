import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Ierc165 } from "./Ierc165";
export declare class Ierc165Factory {
    static connect(address: string, signerOrProvider: Signer | Provider): Ierc165;
}
