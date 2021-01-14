import { MagicUserMetadata } from 'magic-sdk';
import { ethers } from 'ethers';
export declare function getUser(): Promise<MagicUserMetadata | null>;
export declare function loginUser(email: any): Promise<void>;
export declare function logoutUser(): Promise<void>;
export declare function getMagicLink(): import("@magic-sdk/provider").SDKBase & {
    [x: string]: Pick<import("magic-sdk").Extension<string>, never>;
};
export declare function getMagicProvider(): ethers.providers.Web3Provider;
