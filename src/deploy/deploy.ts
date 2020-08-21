
import * as artifactDealRoomDeployer from "../abi/DealRoomDeployer.json";
import * as artifactDealRoom from "../abi/DealRoom.json";
import * as artifactErc20 from "../abi/ERC20Detailed.json";
import * as artifactErc721 from "../abi/ERC721Detailed.json";
import * as artifactMultisig from "../abi/MultiSigWallet.json";
import { getSigner } from "../services/chain/signerFactory";

import { deployContract } from "../services/chain/contractFactory";
import { Erc20Detailed } from "../types/Erc20Detailed";
import { Erc721Detailed } from "../types/Erc721Detailed";
import { DealRoomDeployer } from "../types/DealRoomDeployer";
import { MultiSigWallet } from "../types/MultiSigWallet";
import { Signer } from "ethers";
import { DealRoom } from "../types/DealRoom";

export type DeployedEnvironment = {
    dealRoomDeployer?: DealRoomDeployer
    erc20?: Erc20Detailed
    erc721?: Erc721Detailed
}

export async function deployErc20(owner: string): Promise<Erc20Detailed>  {
    const contract = await deployContract<Erc20Detailed>(await getSigner(), artifactErc20, "BEEF Token", "BEEF", 1 )
    if (owner) {
        await contract.transferOwnership(owner)
        await contract.addMinter(owner);  
    }
    console.log(`Deployed Erc20 contract to ${contract.address}`)
    return contract
}

export async function deployErc721(owner: string): Promise<Erc721Detailed>  {
    const contract = await deployContract<Erc721Detailed>(await getSigner(), artifactErc721, "Cattle", "CAT" )
    if (owner) {
        await contract.transferOwnership(owner)
        await contract.addMinter(owner);
    }
    console.log(`Deployed Erc721 contract to ${contract.address}`)  
    return contract
}

export async function deployMultisig(owners: string[], approvalsRequired: number): Promise<MultiSigWallet>  {
    const contract = await deployContract<MultiSigWallet>(await getSigner(), artifactMultisig, owners, approvalsRequired)
    console.log(`Deployed Multisig contract to ${contract.address}`)
    return contract
}

export async function deployDealRoom(buyer: string, seller: string, owner: string): Promise<DealRoom>  {
    const contract = await deployContract<DealRoom>(await getSigner(), artifactDealRoom, buyer, seller)
    await contract.changeOwner(owner);
    console.log(`Deployed DealRoom contract to ${contract.address}`)
    
    return contract
}

export async function deployAll(): Promise<DeployedEnvironment> {
    const result: DeployedEnvironment = {
        erc20: await deployErc20("0x658040983DD50DD44826FC7e414626Bb8b8180A9"),
        erc721: await deployErc721("0x658040983DD50DD44826FC7e414626Bb8b8180A9")
    }
    return result
}






