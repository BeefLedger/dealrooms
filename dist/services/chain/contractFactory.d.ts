import { Contract, Signer } from "ethers";
export declare function deployContract<T extends Contract>(signer: Signer, compilerOutput: any, ...args: any[]): Promise<T>;
export declare function getContract<T extends Contract>(address: string, abi: any, addressOrIndexOrSigner?: string | number | Signer): Promise<T>;
