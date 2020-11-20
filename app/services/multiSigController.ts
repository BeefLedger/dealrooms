import { MultiSigHashed } from "ethereum/types/MultiSigHashed"
import { ethers, Signer } from "ethers"
import { ContractReceipt } from "ethers/contract"
import { BigNumber, BigNumberish } from "ethers/utils"
import abiDecoder from "abi-decoder"

import * as MultiSigCompiled from "../ethereum/abi/MultiSigHashed.json"
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json"
import { TransactionOverrides } from "ethereum/types"
import { MultiSigWallet } from "ethereum/types/MultiSigWallet"

export const ERROR_MULTIPLE_SUBMISSION_EVENTS = "MULTIPLE_SUBMISSION_EVENTS"
export const ERROR_NO_SUBMISSION_FOUND = "NO_SUBMISSION_FOUND"
export const ERROR_NO_SUBMISSION_HASH_FOUND = "ERROR_NO_SUBMISSION_HASH_FOUND"
export const ERROR_NOT_MULTISIG_OWNER = "NOT_MULTISIG_OWNER"

export type MultiSigTransaction = {
    hash: string;
    data: string;
    destination: string;
    executed: boolean;
    timestamp: ethers.utils.BigNumber;
}

export async function submitMultiSigTransaction(
    multiSigContract: MultiSigHashed,
    destinationAddress: string,
    abi: any,
    fnName: string,
    params: any[],
    signer: Signer
): Promise<string> {
    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), multiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }
    
    //Make the transaction 
    const signerAddress = await signer.getAddress()
    console.log(`Signer ${signerAddress}: Making transaction for fn ${fnName}, params ${JSON.stringify(params, undefined, 4)}` ) 
    const encodedData = new ethers.utils.Interface(abi).functions[fnName].encode(params)
    let transactionOverrides: TransactionOverrides = {
        gasLimit: new BigNumber("999999999999999")
    }
    const transaction = await multiSigContract.submitTransaction(destinationAddress, 0, encodedData, {})
    const receipt = await transaction.wait() 
                
    //Obtain the transaction ID created in the multisig
    try {
        if (receipt.events) {
            console.log(JSON.stringify(receipt.events, undefined, 4))
            const result = await getSubmissionHash(receipt)
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
/*export async function submitDuplexMultiSigApproval(
    primaryMultiSigContract: MultiSigHashed,
    secondaryMultiSigContract: MultiSigWallet,
    secondaryTransactionId: BigNumberish,
    signer: Signer
): Promise<string> {

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
}*/

//Submit a multisig transaction that, when approved, sends a proposal transaction to a second multisig
export async function submitDuplexMultiSigProposal(
    primaryMultiSigContract: MultiSigHashed,
    secondaryMultiSigContract: MultiSigHashed,
    destinationAddress: string,
    destinationAbi: any,
    destinationFnName: string,
    destinationParams: any[],
    signer: Signer
): Promise<string> {

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
export async function approveMultiSigTransaction(multiSigContract: MultiSigHashed, hash: string, signer: Signer): Promise<ContractReceipt> {

    //Check that the signer is an owner
    if (!(await isaMemberOfMultiSig(await signer.getAddress(), multiSigContract))) {
        throw new Error(ERROR_NOT_MULTISIG_OWNER)
    }

    const transaction = await multiSigContract.confirmTransaction(hash, {gasLimit: 999999})
    const receipt = await transaction.wait() 
    return receipt
}

export function getSubmissionId(receipt: ContractReceipt): string {
    const submissionEvents = receipt.events?.filter(evt => evt.event === 'Submission' || evt.event === 'Confirmation')
    if (submissionEvents) { 
        if (submissionEvents.length > 0) {
            return (submissionEvents[0]?.args as any).hash       
        }
    } 
    throw new Error(ERROR_NO_SUBMISSION_FOUND)
}

export function getSubmissionHash(receipt: ContractReceipt): string {
    const submissionEvents = receipt.events?.filter(evt => evt.event === 'SubmissionHashed')
    if (submissionEvents) { 
        if (submissionEvents.length > 0) {
            if (submissionEvents.length === 1) {
                return (submissionEvents[0]?.args as any).hash
            }
            throw new Error(ERROR_MULTIPLE_SUBMISSION_EVENTS)
        }
    } 
    throw new Error(ERROR_NO_SUBMISSION_HASH_FOUND)
}

function _makeMultiSigTransaction(rawInput: { 0: string, 1: string; 2: string; 3: boolean; 4: ethers.utils.BigNumber }): MultiSigTransaction {
    return {
        hash: rawInput[0],
        data: rawInput[1],
        destination: rawInput[2],
        executed: rawInput[3],
        timestamp: rawInput[4],
    } 
}

export async function getTransactions(multiSigContract: MultiSigHashed): Promise<MultiSigTransaction[]> {
    const transactions: MultiSigTransaction[] = []
    const transactionCount = (await multiSigContract.transactionCount()).toNumber()
    for (let i = 0; i < transactionCount; i ++ ) {
        const transaction = _makeMultiSigTransaction(await multiSigContract.getTransactionByIdx(i))
        transactions.push(transaction)
    }
    return transactions
}

export async function getConfirmations(multiSigContract: MultiSigHashed, hash: string): Promise<string[]> {
    return multiSigContract.getConfirmations(hash)
}

export async function getTransaction(multiSigContract: MultiSigHashed, hash: string): Promise<MultiSigTransaction> {
    return _makeMultiSigTransaction(await multiSigContract.getTransaction(hash))
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