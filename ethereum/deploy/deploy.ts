
import * as artifactDealHub from "../abi/DealHub.json"
//import * as artifactDeal from "../abi/Deal.json"
import * as artifactTestCoin from "../abi/TestCoin.json"
import * as artifactTestAsset from "../abi/TestAsset.json"
import * as artifactMultisig from "../abi/MultiSigHashed.json"
import * as artifactTestContract from "../abi/TestContract.json"


import { deployContract } from "../../services/chain/contractFactory"
import { TestCoin } from "../types/TestCoin"
import { TestAsset } from "../types/TestAsset"

import { DealHub } from "../types/DealHub"
//import { Deal as DealContract } from "../types/Deal"
import { MultiSigHashed } from "../types/MultiSigHashed"
import { TestContract } from "../types/TestContract"

import { BigNumberish, Signer } from "ethers"
import { getDealHubContract } from "../../services/chain/prefabContractFactory"
//import { Deal, DealRoomDetails } from "../../services/dealRoomController"

//import { BigNumber } from "ethers"
//import { DealListing } from "services/chain/dealController"


export type DeployedEnvironment = {
    DealHub?: DealHub
    erc20?: TestCoin
    erc721?: TestAsset 
}

export type DeployDealParams = {
    dealHubAddress: string
    buyer: string
    seller: string
    arbitrator?: string
    sensor?: string
    docApprover?: string
    erc20: string
    erc721: string
    price: BigNumberish
    assetItems: BigNumberish[]
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

export async function deployDealHub(signer: Signer): Promise<DealHub>  {
    const contract = await deployContract<DealHub>(signer, artifactDealHub)  
    return contract
}

export async function deployDeal(params: DeployDealParams, owner: string, signer: Signer): Promise<string>  {
    try {
        let dealAddress: string
        const dealHubContract = await getDealHubContract(params.dealHubAddress, signer)
        const tx = await dealHubContract.functions.makeDeal(params.buyer, params.seller, params.erc20, params.erc721, params.price, params.assetItems)
        const receipt = await tx.wait()

        //TODO: Make this a generic event finder
        const dealCreatedEvents = receipt.events?.filter(evt => evt.event === 'DealCreated')
        if (dealCreatedEvents) { 
            if (dealCreatedEvents.length > 0) {
                if (dealCreatedEvents.length === 1) {
                    dealAddress = (dealCreatedEvents[0]?.args as any).addr
                } else {
                    throw new Error(ERROR_MULTIPLE_EVENTS)
                }
            }
        } else {
            throw new Error(ERROR_NO_EVENT_FOUND)
        } 

        return dealAddress
    }
    catch (e) {
        console.error("deployDeal()", e)
    }
}

export async function deployAll(signer: Signer): Promise<DeployedEnvironment> {
    const result: DeployedEnvironment = {
        erc20: await deployTestCoin(signer),
        erc721: await deployTestAsset(signer),
        DealHub: await deployDealHub(signer),
    }
    return result
}










