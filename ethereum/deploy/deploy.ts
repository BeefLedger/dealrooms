
import * as artifactDealRoomHub from "../abi/DealRoomHub.json"
import * as artifactTestCoin from "../abi/TestCoin.json"
import * as artifactTestAsset from "../abi/TestAsset.json"
import * as artifactMultisig from "../abi/MultiSigHashed.json"
import * as artifactTestContract from "../abi/TestContract.json"

import { deployContract } from "../../services/chain/contractFactory"
import { TestCoin } from "../types/TestCoin"
import { TestAsset } from "../types/TestAsset"

import { DealRoomHub } from "../types/DealRoomHub"
import { MultiSigHashed } from "../types/MultiSigHashed"
import { TestContract } from "../types/TestContract"

import { Signer } from "ethers"
import { getDealRoomHubContract } from "../../services/chain/prefabContractFactory"
import { DealRoomDetails } from "../../services/dealRoomController"
import { DealRoom } from "../../ethereum/types/DealRoom"
// import { DealRoom } from "ethereum/types/DealRoom"

export type DeployedEnvironment = {
    DealRoomHub?: DealRoomHub
    erc20?: TestCoin
    erc721?: TestAsset 
}

export const ERROR_NO_EVENT_FOUND = "NO_EVENT_FOUND"
export const ERROR_MULTIPLE_EVENTS = "ERROR_MULTIPLE_EVENTS"

export async function deployTestCoin(signer: Signer): Promise<TestCoin> {
    const contract = await deployContract<TestCoin>(signer, artifactTestCoin )

    return contract
}

export async function deployTestAsset(signer: Signer): Promise<TestAsset> {
    const contract = await deployContract<TestAsset>(signer, artifactTestAsset)

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

export async function deployDealRoomHub(signer: Signer): Promise<DealRoomHub>  {
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


export type DealRoomBasicCreateParams = {
    dealRoomHubAddress: string
    buyer: string
    seller: string
}

export async function deployDealRoom(params: DealRoomCreateParams, owner: string, signer: Signer): Promise<DealRoomDetails>  {
    try {
        let roomAddress: string
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

export async function deployBasicDealRoom(params: DealRoomBasicCreateParams, owner: string, signer: Signer): Promise<DealRoomDetails>  {
    try {
        let roomAddress: string
        const DealRoomHubContract = await getDealRoomHubContract(params.dealRoomHubAddress, signer)
        const tx = await DealRoomHubContract.functions.makeBasicRoom(params.buyer, params.seller)
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
        erc20: await deployTestCoin(signer),
        erc721: await deployTestAsset(signer),
        DealRoomHub: await deployDealRoomHub(signer),
    }
    return result
}










