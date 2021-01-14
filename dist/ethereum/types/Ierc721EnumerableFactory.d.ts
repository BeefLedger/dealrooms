import { Signer } from "ethers";
import { Provider } from "ethers/providers";
import { Ierc721Enumerable } from "./Ierc721Enumerable";
export declare class Ierc721EnumerableFactory {
    static connect(address: string, signerOrProvider: Signer | Provider): Ierc721Enumerable;
}
