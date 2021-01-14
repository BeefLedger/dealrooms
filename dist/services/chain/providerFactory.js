import { ethers } from "ethers";
export function getProvider(web3Provider) {
    //return new ethers.providers.Web3Provider(ganache.provider())
    if (web3Provider) {
        return new ethers.providers.Web3Provider(web3Provider);
    }
    else {
        return new ethers.providers.JsonRpcProvider(); //"https://beefledgerwallet.com:8544");
    }
}
