
import * as artifactDealRoom from "../abi/DealRoom.json"
import * as artifactErc20 from "../abi/ERC20Detailed.json"
import * as artifactErc721 from "../abi/ERC721Detailed.json"
import * as artifactMultisig from "../abi/MultiSigWallet.json"
import { getSigner } from "../../services/chain/signerFactory"

import { deployContract } from "../../services/chain/contractFactory"
import { Erc20Detailed } from "../types/Erc20Detailed"
import { Erc721Detailed } from "../types/Erc721Detailed"
import { DealRoomDeployer } from "../types/DealRoomDeployer"
import { MultiSigWallet } from "../types/MultiSigWallet"
import { DealRoom } from "../types/DealRoom"
import { Signer } from "ethers"

export type DeployedEnvironment = {
    dealRoomDeployer?: DealRoomDeployer
    erc20?: Erc20Detailed
    erc721?: Erc721Detailed
}

export async function deployErc20(owner: string, signer: Signer): Promise<Erc20Detailed>  {
    const contract = await deployContract<Erc20Detailed>(signer, artifactErc20, "BEEF Token", "BEEF", 1 )
    if (owner) {
        await contract.transferOwnership(owner)
        await contract.addMinter(owner);  
    }
    console.log(`Deployed Erc20 contract to ${contract.address}`)
    return contract
}

export async function deployErc721(owner: string, signer: Signer): Promise<Erc721Detailed>  {
    const contract = await deployContract<Erc721Detailed>(signer, artifactErc721, "Cattle", "CAT" )
    if (owner) {
        await contract.transferOwnership(owner)
        await contract.addMinter(owner);
    }
    console.log(`Deployed Erc721 contract to ${contract.address}`)  
    return contract
}

export async function deployMultisig(owners: string[], approvalsRequired: number, signer: Signer): Promise<MultiSigWallet>  {
    try {
        console.log(`deployMultisig()`)
        const contract = await deployContract<MultiSigWallet>(signer, artifactMultisig, owners, approvalsRequired)
        console.log(`Deployed Multisig contract to ${contract.address}`)
        return contract
    } catch (e) {
        throw `deployMultisig(): ${e}`
    }

}

export async function deployDealRoom(buyer: string, seller: string, owner: string, signer: Signer): Promise<DealRoom>  {

    const contract = await deployContract<DealRoom>(signer, artifactDealRoom, buyer, seller)
    await contract.changeOwner(owner);
    console.log(`Deployed DealRoom contract to ${contract.address}`)
    
    return contract
}

export async function deployAll(signer: Signer): Promise<DeployedEnvironment> {
    const result: DeployedEnvironment = {
        erc20: await deployErc20("0x658040983DD50DD44826FC7e414626Bb8b8180A9", signer),
        erc721: await deployErc721("0x658040983DD50DD44826FC7e414626Bb8b8180A9", signer)
    }
    return result
}

/*export async function setupDemoEnvironment(): Promise<DeployedEnvironment> {
    return await setupDemo()
}*/









