import { ethers } from "ethers";
export function getProvider() {
    return new ethers.providers.JsonRpcProvider(); //"https://beefledgerwallet.com:8544");
}
