import { ethers } from "ethers"
import * as ganache from "ganache-cli"
const provider = new ethers.providers.Web3Provider(ganache.provider());

export function getProvider(): ethers.providers.JsonRpcProvider {
    //return new ethers.providers.Web3Provider(ganache.provider())
    return new ethers.providers.JsonRpcProvider()//"https://beefledgerwallet.com:8544");
}

