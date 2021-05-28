import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Ierc721Metadata } from "./Ierc721Metadata";
export declare class Ierc721MetadataFactory {
    static connect(address: string, signerOrProvider: Signer | Provider): Ierc721Metadata;
}
