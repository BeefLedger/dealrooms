
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

/*
export type DealRoomBasicCreateParams = {
    dealRoomHubAddress: string
    buyer: string
    seller: string
}
*/

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
/*
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

        const dealRoomDetails = await DealRoomHubContract.getRoom(roomAddress)//functions.getRoom(roomAddress)
        return dealRoomDetails;
    }
    catch (e) {
        console.error("deployDealRoom()", e)
    }
}

export async function deployRoomAndDeal(roomParams: DealRoomBasicCreateParams, deal: Deal, signer: Signer): Promise<{roomAddress: string, dealId: number}> {
    console.log(`deployRoomAndDeal ${1}`)
    let roomAddress: string
    const DealRoomHubContract = await getDealRoomHubContract(roomParams.dealRoomHubAddress, signer)
    console.log(`deployRoomAndDeal ${2}`)
    const tx = await DealRoomHubContract.functions.makeBasicRoomAndDeal(roomParams.buyer, roomParams.seller, deal.erc20, deal.erc721, BigNumber.from(deal.price), deal.assetItems)  
    console.log(`deployRoomAndDeal ${3}`)
    const receipt = await tx.wait()
    console.log(`deployRoomAndDeal ${4}`)
    
    //TODO: Make this a generic event finder
    const newRoomEvents = receipt.events?.filter(evt => evt.event === 'NewRoomEvent')
    if (newRoomEvents) { 
        console.log(`deployRoomAndDeal ${4.1}`)
        if (newRoomEvents.length > 0) {
            if (newRoomEvents.length === 1) {
                console.log(`deployRoomAndDeal ${4.2}`)
                roomAddress = (newRoomEvents[0]?.args as any).addr
            } else {
                console.log(`deployRoomAndDeal ${4.3}`)
                throw new Error(ERROR_MULTIPLE_EVENTS)
            }
        }
    } else {
        console.log(`deployRoomAndDeal ${4.4}`)
        throw new Error(ERROR_NO_EVENT_FOUND)
    } 
    console.log(`deployRoomAndDeal ${5}`)
    return {
        roomAddress,
        dealId: 0
    }
}
*/
export async function deployAll(signer: Signer): Promise<DeployedEnvironment> {
    const result: DeployedEnvironment = {
        erc20: await deployTestCoin(signer),
        erc721: await deployTestAsset(signer),
        DealHub: await deployDealHub(signer),
    }
    return result
}










