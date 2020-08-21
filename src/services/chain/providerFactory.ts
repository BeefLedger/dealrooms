import { ethers } from "ethers"

export function getProvider(): ethers.providers.JsonRpcProvider {
    //return new ethers.providers.Web3Provider(ganache.provider())
    return new ethers.providers.JsonRpcProvider()//"https://beefledgerwallet.com:8544");
}

