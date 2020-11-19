import { MultiSigHashed } from "ethereum/types/MultiSigHashed"
import { ethers, Signer } from "ethers"
import { ContractReceipt } from "ethers/contract"
import { BigNumberish } from "ethers/utils"
import abiDecoder from "abi-decoder"

import * as MultiSigCompiled from "../ethereum/abi/MultiSigHashed.json"
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json"

export const ERROR_MULTIPLE_SUBMISSION_EVENTS = "MULTIPLE_SUBMISSION_EVENTS"
export const ERROR_NO_SUBMISSION_FOUND = "NO_SUBMISSION_FOUND"
export const ERROR_NO_SUBMISSION_HASH_FOUND = "ERROR_NO_SUBMISSION_HASH_FOUND"
export const ERROR_NOT_MULTISIG_OWNER = "NOT_MULTISIG_OWNER"

export type MultiSigTransaction = {
    id: number;
    data: string;
    destination: string;
    executed: boolean;
    timestamp: ethers.utils.BigNumber;
}

export type MultiSigSubmissionResult = {
    id: BigNumberish,
    hash: string
}

export async function submitMultiSigTransaction(
    multiSigContract: MultiSigHashed,
    destinationAddress: string,
    abi: any,
    fnName: string,
    params: any[],
    signer: Signer
): Promise<MultiSigSubmissionResult> {
    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), multiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }
    
    //Make the transaction 
    const signerAddress = await signer.getAddress()
    console.log(`Signer ${signerAddress}: Making transaction for fn ${fnName}, params ${JSON.stringify(params, undefined, 4)}` ) 
    const encodedData = new ethers.utils.Interface(abi).functions[fnName].encode(params)
    const transaction = await multiSigContract.submitTransaction(destinationAddress, 0, encodedData)
    const receipt = await transaction.wait() 
                
    //Obtain the transaction ID created in the multisig
    try {
        if (receipt.events) {
            const result: MultiSigSubmissionResult = {
                id: await getSubmissionId(receipt),
                hash: await getSubmissionHash(receipt)
            }
            return result
        }
        throw `No submission events`      
    }
    catch (e) {
        //console.error(JSON.stringify(e, undefined, 4))
        throw `Error getting submission results: ${e}`
    }
}

//Submit a multisig transaction that approves a transaction in a second multisig
export async function submitDuplexMultiSigApproval(
    primaryMultiSigContract: MultiSigHashed,
    secondaryMultiSigContract: MultiSigHashed,
    secondaryTransactionId: BigNumberish,
    signer: Signer
): Promise<MultiSigSubmissionResult> {

    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), primaryMultiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }

    return submitMultiSigTransaction(
        primaryMultiSigContract,
        secondaryMultiSigContract.address,
        MultiSigCompiled.abi,
        "confirmTransaction",
        [secondaryTransactionId],
        signer
    )
}

//Submit a multisig transaction that, when approved, sends a proposal transaction to a second multisig
export async function submitDuplexMultiSigProposal(
    primaryMultiSigContract: MultiSigHashed,
    secondaryMultiSigContract: MultiSigHashed,
    destinationAddress: string,
    destinationAbi: any,
    destinationFnName: string,
    destinationParams: any[],
    signer: Signer
): Promise<MultiSigSubmissionResult> {

    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), primaryMultiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }
    const encodedData = new ethers.utils.Interface(destinationAbi).functions[destinationFnName].encode(destinationParams)
    return submitMultiSigTransaction(
        primaryMultiSigContract,
        secondaryMultiSigContract.address,
        MultiSigCompiled.abi,
        "submitTransaction",
        [destinationAddress, 0, encodedData],
        signer
    )
}
export async function approveMultiSigTransaction(multiSigContract: MultiSigHashed, transactionId: BigNumberish, signer: Signer): Promise<ContractReceipt> {

    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), multiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }

    const transaction = await multiSigContract.confirmTransaction(transactionId, {gasLimit: 999999})
    const receipt = await transaction.wait() 
    return receipt
}

export function getSubmissionId(receipt: ContractReceipt): BigNumberish {
    const submissionEvents = receipt.events?.filter(evt => evt.event === 'Submission' || evt.event === 'Confirmation')
    if (submissionEvents) { 
        if (submissionEvents.length > 0) {
            const transactionId: BigNumberish = (submissionEvents[0]?.args as any).transactionId
            return transactionId          
        }
    } 
    /*const confirmationEvents = receipt.events?.filter(evt => evt.event === 'Confirmation')
    if (confirmationEvents) { 
        if (confirmationEvents.length > 0) {
            if (confirmationEvents.length === 1) {
                const transactionId: BigNumberish = (confirmationEvents[0]?.args as any).transactionId
                return transactionId
            }
            throw new Error(ERROR_MULTIPLE_CONFIRMATION_EVENTS)
        }
    }*/
    throw new Error(ERROR_NO_SUBMISSION_FOUND)
}

export function getSubmissionHash(receipt: ContractReceipt): string {
    const submissionEvents = receipt.events?.filter(evt => evt.event === 'SubmissionHashed')
    if (submissionEvents) { 
        if (submissionEvents.length > 0) {
            if (submissionEvents.length === 1) {
                const hash: string = (submissionEvents[0]?.args as any).hash
                return hash
            }
            throw new Error(ERROR_MULTIPLE_SUBMISSION_EVENTS)
        }
    } 
    throw new Error(ERROR_NO_SUBMISSION_HASH_FOUND)
}

export async function getTransactions(multiSigContract: MultiSigHashed): Promise<MultiSigTransaction[]> {
    const transactions: MultiSigTransaction[] = []
    const transactionCount = (await multiSigContract.transactionCount()).toNumber()
    for (let i = 0; i < transactionCount; i ++ ) {
        const transaction: { 0: string; 1: string; 2: boolean; 3: ethers.utils.BigNumber } = await multiSigContract.getTransaction(i)
        transactions.push({
            id: i,
            data: transaction[0],
            destination: transaction[1],
            executed: transaction[2],
            timestamp: transaction[3],
        })
    }
    return transactions
}

export async function isaMemberOfMultiSig(addr: string, multiSigContract: MultiSigHashed): Promise<boolean> {
    const owners = await multiSigContract.getOwners()
    // console.log(`isaMemberOfMultiSig(${addr}): ${JSON.stringify(owners, undefined, 4)}`)
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