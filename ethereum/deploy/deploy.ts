
import * as artifactDealRoomHub from "../abi/DealRoomHub.json"
import * as artifactErc20 from "../abi/ERC20Detailed.json"
import * as artifactErc721 from "../abi/ERC721Detailed.json"
import * as artifactMultisig from "../abi/MultiSigHashed.json"
import * as artifactTestContract from "../abi/TestContract.json"

import { deployContract } from "../../services/chain/contractFactory"
import { Erc20Detailed } from "../types/Erc20Detailed"
import { Erc721Detailed } from "../types/Erc721Detailed"
import { DealRoomHub } from "../types/DealRoomHub"
import { MultiSigHashed } from "../types/MultiSigHashed"
import { TestContract } from "../types/TestContract"

import { Signer } from "ethers"
import { getDealRoomHubContract } from "../../services/chain/prefabContractFactory"
import { DealRoomDetails } from "../../services/dealRoomController"

export type DeployedEnvironment = {
    DealRoomHub?: DealRoomHub
    erc20?: Erc20Detailed
    erc721?: Erc721Detailed 
}

export const ERROR_NO_EVENT_FOUND = "NO_EVENT_FOUND"
export const ERROR_MULTIPLE_EVENTS = "ERROR_MULTIPLE_EVENTS"

export async function deployErc20(owner: string, signer: Signer): Promise<Erc20Detailed>  {
    const contract = await deployContract<Erc20Detailed>(signer, artifactErc20, "BEEF Token", "BEEF", 1 )
    if (owner) {
        await contract.transferOwnership(owner)
        await contract.addMinter(owner);  
    }
    return contract
}

export async function deployErc721(owner: string, signer: Signer): Promise<Erc721Detailed>  {
    const contract = await deployContract<Erc721Detailed>(signer, artifactErc721, "Cattle", "CAT" )
    if (owner) {
        await contract.transferOwnership(owner)
        await contract.addMinter(owner);
    }
    return contract
}

export async function deployTestContract(signer: Signer): Promise<TestContract>  {
    try {
        const contract = await deployContract<TestContract>(signer, artifactTestContract)
        return contract
    } catch (e) {
        throw `deployTestContract(): ${e}`
    }

}


export async function deployMultisig(owners: string[], approvalsRequired: number, signer: Signer): Promise<MultiSigHashed>  {
    try {
        const contract = await deployContract<MultiSigHashed>(signer, artifactMultisig, owners, approvalsRequired)
        return contract
    } catch (e) {
        throw `deployMultisig(): ${e}`
    }

}

export async function deployDealRoomHub(owner: string, signer: Signer): Promise<DealRoomHub>  {
    const contract = await deployContract<DealRoomHub>(signer, artifactDealRoomHub)  
    return contract
}

export type DealRoomCreateParams = {
    dealRoomHubAddress: string
    buyer: string
    seller: string
    arbitrator: string
    docApprover: string
    sensorApprover: string
}



export async function deployDealRoom(params: DealRoomCreateParams, owner: string, signer: Signer): Promise<DealRoomDetails>  {
    try {
        let roomAddress: string
        debugger
        const DealRoomHubContract = await getDealRoomHubContract(params.dealRoomHubAddress, signer)
        const tx = await DealRoomHubContract.functions.makeRoom(params)
        const receipt = await tx.wait()

        //TODO: Make this a generic event finder
        const newRoomEvents = receipt.events?.filter(evt => evt.event === 'NewRoomEvent')
        if (newRoomEvents) { 
            if (newRoomEvents.length > 0) {
                if (newRoomEvents.length === 1) {
                    roomAddress = (newRoomEvents[0]?.args as any).addr
                } else {
                    throw new Error(ERROR_MULTIPLE_EVENTS)
                }
            }
        } else {
            throw new Error(ERROR_NO_EVENT_FOUND)
        } 

        const dealRoomDetails = await DealRoomHubContract.functions.getRoom(roomAddress)
        return dealRoomDetails;
    }
    catch (e) {
        console.error("deployDealRoom()", e)
    }

}

export async function deployAll(signer: Signer): Promise<DeployedEnvironment> {
    const result: DeployedEnvironment = {
        erc20: await deployErc20("0x658040983DD50DD44826FC7e414626Bb8b8180A9", signer),
        erc721: await deployErc721("0x658040983DD50DD44826FC7e414626Bb8b8180A9", signer),
        DealRoomHub: await deployDealRoomHub("0x658040983DD50DD44826FC7e414626Bb8b8180A9", signer),
    }
    return result
}










