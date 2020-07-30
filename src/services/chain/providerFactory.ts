import { ethers } from "ethers";

export function getProvider(): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider();
}

