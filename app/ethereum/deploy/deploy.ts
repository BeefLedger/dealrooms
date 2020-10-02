
import * as artifactDealRoom from "../abi/DealRoom.json"
import * as artifactDealRoomHub from "../abi/DealRoomHub.json"
import * as artifactErc20 from "../abi/ERC20Detailed.json"
import * as artifactErc721 from "../abi/ERC721Detailed.json"
import * as artifactMultisig from "../abi/MultiSigWallet.json"

import { getSigner } from "../../services/chain/signerFactory"

import { deployContract } from "../../services/chain/contractFactory"
import { Erc20Detailed } from "../types/Erc20Detailed"
import { Erc721Detailed } from "../types/Erc721Detailed"
import { DealRoomHub } from "../types/DealRoomHub"
import { MultiSigWallet } from "../types/MultiSigWallet"
import { DealRoom } from "../types/DealRoom"

import { Signer } from "ethers"
import { getDealRoomHubContract } from "services/chain/prefabContractFactory"

export type DeployedEnvironment = {
    DealRoomHub?: DealRoomHub
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

export async function deployDealRoomHub(owner: string, signer: Signer): Promise<DealRoomHub>  {

    const contract = await deployContract<DealRoomHub>(signer, artifactDealRoomHub)
    console.log(`Deployed DealRoomHub contract to ${contract.address}`)
    
    return contract
}

export type DeployDealRoomParams = {
    id: number,
    buyer: string,
    seller: string,
    arbitrator: string,
    sensorApprover: string,
    docApprover: string,
}

export type DealRoomDetails = {
    room: string;
    buyer: string;
    seller: string;
    arbitrator: string;
    sensorApprover: string;
    docApprover: string;
    mainMultiSig: string;
    agentsMultiSig: string;   
}

export async function deployDealRoom(DealRoomHubAddress: string, params: DeployDealRoomParams, owner: string, signer: Signer): Promise<DealRoomDetails>  {
    console.log(1)
    const DealRoomHubContract = await getDealRoomHubContract(DealRoomHubAddress, signer)
    console.log(2, JSON.stringify(params, undefined, 4))
    await DealRoomHubContract.functions.makeRoom(params)
    console.log(3)
    const dealRoomDetails = await DealRoomHubContract.functions.getRoom(params.id)
    console.log(4)
    return dealRoomDetails;
}

export async function deployAll(signer: Signer): Promise<DeployedEnvironment> {
    const result: DeployedEnvironment = {
        erc20: await deployErc20("0x658040983DD50DD44826FC7e414626Bb8b8180A9", signer),
        erc721: await deployErc721("0x658040983DD50DD44826FC7e414626Bb8b8180A9", signer),
        DealRoomHub: await deployDealRoomHub("0x658040983DD50DD44826FC7e414626Bb8b8180A9", signer),
    }
    return result
}

/*export async function setupDemoEnvironment(): Promise<DeployedEnvironment> {
    return await setupDemo()
}*/









