import { ethers } from "ethers"
import { JsonRpcProvider, Web3Provider } from "ethers/providers"

export function getProvider(web3Provider?: Web3Provider): ethers.providers.JsonRpcProvider {
    //return new ethers.providers.Web3Provider(ganache.provider())
    if (web3Provider) {
        return new ethers.providers.Web3Provider(web3Provider)
    } else {
        return new ethers.providers.JsonRpcProvider()//"https://beefledgerwallet.com:8544");
    }    
}

