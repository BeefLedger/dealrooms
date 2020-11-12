import { MultiSigWallet } from "ethereum/types/MultiSigWallet"
import { ethers, Signer } from "ethers"
import { ContractReceipt } from "ethers/contract"
import { BigNumberish } from "ethers/utils"
import abiDecoder from "abi-decoder"

import * as MultiSigCompiled from "../ethereum/abi/MultiSigWallet.json"
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json"

export const ERROR_MULTIPLE_SUBMISSION_EVENTS = "MULTIPLE_SUBMISSION_EVENTS"
export const ERROR_NO_SUBMISSION_FOUND = "NO_SUBMISSION_FOUND"
export const ERROR_NOT_MULTISIG_OWNER = "NOT_MULTISIG_OWNER"


export async function submitMultiSigTransaction(
    multiSigContract: MultiSigWallet,
    transactionId: BigNumberish,
    destinationAddress: string,
    abi: any,
    fnName: string,
    params: any[],
    signer: Signer
): Promise<boolean> {
    debugger
    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), multiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }
    
    //Make the transaction 
    console.log(`Making transaction for fn ${fnName}, params ${JSON.stringify(params, undefined, 4)}` ) 
    const encodedData = new ethers.utils.Interface(abi).functions[fnName].encode(params)
    const transaction = await multiSigContract.submitTransaction(transactionId, destinationAddress, 0, encodedData)
    const receipt = await transaction.wait() 
                
    //Obtain the transaction ID created in the multisig
    try {
        if (receipt.events) {
            return (getSubmittedTransactionId(receipt) == transactionId)
        }
        throw `No submission events`         
    }
    catch (e) {
        //console.error(JSON.stringify(e, undefined, 4))
        throw `Error getting new transaction ID: ${e}`
    }
}

//Submit a multisig transaction that approves a transaction in a second multisig
export async function submitDuplexMultiSigApproval(
    primaryMultiSigContract: MultiSigWallet,
    transactionId: BigNumberish,
    secondaryMultiSigContract: MultiSigWallet,
    secondaryTransactionId: BigNumberish,
    signer: Signer
): Promise<boolean> {

    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), primaryMultiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }

    return submitMultiSigTransaction(
        primaryMultiSigContract,
        transactionId,
        secondaryMultiSigContract.address,
        MultiSigCompiled.abi,
        "confirmTransaction",
        [secondaryTransactionId],
        signer
    )
}

export async function approveMultiSigTransaction(multiSigContract: MultiSigWallet, transactionId: BigNumberish, signer: Signer): Promise<ContractReceipt> {

    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), multiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }

    const transaction = await multiSigContract.confirmTransaction(transactionId, {gasLimit: 999999})
    const receipt = await transaction.wait() 
    return receipt
}

export function getSubmittedTransactionId(receipt: ContractReceipt): BigNumberish {
    const submissionEvents = receipt.events?.filter(evt => evt.event === 'Submission')
    if (submissionEvents) { 
        if (submissionEvents.length > 0) {
            if (submissionEvents.length === 1) {
                const transactionId: BigNumberish = (submissionEvents[0]?.args as any).transactionId
                return transactionId
            }
            throw new Error(ERROR_MULTIPLE_SUBMISSION_EVENTS)
        }
    } 
    throw new Error(ERROR_NO_SUBMISSION_FOUND)
}


export async function isaMemberOfMultiSig(addr: string, multiSigContract: MultiSigWallet): Promise<boolean> {
    const owners = await multiSigContract.getOwners()
    console.log(`isaMemberOfMultiSig(${addr}): ${JSON.stringify(owners, undefined, 4)}`)
    if (!owners.includes(addr)) {
        const owners = await multiSigContract.getOwners()
        return false
    } else {
        return true
    }
}

export const decodeParams = (data, abi) => {
    abiDecoder.addABI(abi);
    return abiDecoder.decodeMethod(data);
}

export function decodeDealRoomTransaction(encoded: string): any {
    //Identify the method and parameters
    return decodeParams(encoded, DealRoomCompiled.abi)   
}

export function decodeMultiSigTransaction(encoded: string): any {
    //Identify the method and parameters
    return decodeParams(encoded, MultiSigCompiled.abi)   
}

