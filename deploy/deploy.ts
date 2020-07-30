import { deployContract } from "../services/chain/contractFactory";
import * as artifactDealRoomDeployer from "../build/contracts/DealRoomDeployer.json";
import * as artifactErc20 from "../build/contracts/ERC20Detailed.json";
import * as artifactErc721 from "../build/contracts/ERC721Detailed.json";
import { getSigner } from "../services/chain/signerFactory";
import { DealRoomDeployer } from "../build/types/DealRoomDeployer"
import { DealRoom } from "../build/types/DealRoom"
import { Erc721Detailed } from "../build/types/Erc721Detailed"
import { Erc20Detailed } from "../build/types/Erc20Detailed"

export type DeployedEnvironment = {
    dealRoomDeployer?: DealRoomDeployer
    erc20?: Erc20Detailed
    erc721?: Erc721Detailed
}

export async function deployDealRoomDeployer(): Promise<DealRoomDeployer>  {
    const contract = await deployContract<DealRoomDeployer>(await getSigner(), artifactDealRoomDeployer)
    return contract
}

export async function deployErc20(owner?: string): Promise<Erc20Detailed>  {
    const contract = await deployContract<Erc20Detailed>(await getSigner(), artifactErc20, "BEEF Token", "BEEF", 1 )
    if (owner) {
        await contract.transferOwnership(owner); 
        await contract.addMinter(owner);  
    }

    return contract
}

export async function deployErc721(owner?: string): Promise<Erc721Detailed>  {
    const contract = await deployContract<Erc721Detailed>(await getSigner(), artifactErc721, "Cattle", "CAT" );
    if (owner) {
        await contract.transferOwnership(owner); 
        await contract.addMinter(owner);
    }   
    return contract
}

export async function deployAll(): Promise<DeployedEnvironment> {
    const result: DeployedEnvironment = {
        dealRoomDeployer: await deployDealRoomDeployer(),
        erc20: await deployErc20("0x658040983DD50DD44826FC7e414626Bb8b8180A9"),
        erc721: await deployErc721()
    }
    return result
}






