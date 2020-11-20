import { MultiSigHashed } from "ethereum/types/MultiSigHashed"
import { ethers, Signer } from "ethers"
import { ContractReceipt } from "ethers/contract"
import { BigNumber, BigNumberish } from "ethers/utils"
import abiDecoder from "abi-decoder"

import * as MultiSigCompiled from "../ethereum/abi/MultiSigHashed.json"
import * as DealRoomCompiled from "../ethereum/abi/DealRoom.json"
import { TransactionOverrides } from "ethereum/types"
import { MultiSigWallet } from "ethereum/types/MultiSigWallet"
import { string } from "yargs"
import { getMultiSigContract } from "./chain/prefabContractFactory"

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

export class MultiSigController {
    private _signer: Signer
    private _address?: string;
    private _contract?: MultiSigHashed
    private _signerAddress?: string;

    constructor(multiSigAddress: string, signer: Signer) {
        this._signer = signer
        
        this._address = multiSigAddress
    }

    // Fetch resources
    public async init() {
        try {
            //Connect to the contract with my signer
            this._contract = await getMultiSigContract(this._address, this._signer)
            this._signerAddress = await this._signer.getAddress()
        }
        catch (e) {
            throw Error(`Failed to get MultiSig contract: ${e}`)
        }
    }

    public async makeHash(
        destinationAddress: string,
        abi: any,
        fnName: string,
        params: any[]): Promise<string>
    {
    const encodedData = new ethers.utils.Interface(abi).functions[fnName].encode(params) 
        return this._contract.makeHash(destinationAddress, 0, encodedData)
    }

    public async submitMultiSigTransaction(
        destinationAddress: string,
        abi: any,
        fnName: string,
        params: any[]
    ): Promise<string> {
        //Check that the signer is an owner
        if (!(await this.isaMemberOfMultiSig(this._signerAddress))) {
            throw new Error(ERROR_NOT_MULTISIG_OWNER)
        }
        
        //Make the transaction 
        await this._signerAddress
        console.log(`Signer ${this._signerAddress}: Making transaction for fn ${fnName}, params ${JSON.stringify(params, undefined, 4)}` ) 
        const encodedData = new ethers.utils.Interface(abi).functions[fnName].encode(params)

        const transaction = await this._contract.submitTransaction(destinationAddress, 0, encodedData, {gasLimit: new BigNumber("5999999")})
        const receipt = await transaction.wait() 
                    
        //Obtain the transaction ID created in the multisig
        try {
            if (receipt.events) {
                console.log(JSON.stringify(receipt.events, undefined, 4))
                const result = await MultiSigController.getSubmissionHash(receipt)
                return result
            }
            throw `No submission events`      
        }
        catch (e) {
            //console.error(JSON.stringify(e, undefined, 4))
            throw `Error getting submission results: ${e}`
        }
    }

    //Submit a multisig transaction that, when approved, sends a proposal transaction to a second multisig
    public async submitDuplexMultiSigProposal(
        secondaryMultiSigContract: string,
        destinationAddress: string,
        destinationAbi: any,
        destinationFnName: string,
        destinationParams: any[]
    ): Promise<string> {
    
        //Check that the signer is an owner
        if (!(await this.isaMemberOfMultiSig(this._signerAddress))) {
            throw new Error(ERROR_NOT_MULTISIG_OWNER)
        }
        const encodedData = new ethers.utils.Interface(destinationAbi).functions[destinationFnName].encode(destinationParams)
        return this.submitMultiSigTransaction(
            secondaryMultiSigContract,
            MultiSigCompiled.abi,
            "submitTransaction",
            [destinationAddress, 0, encodedData],
        )
    }

    public static getSubmissionHash(receipt: ContractReceipt): string {
        const submissionEvents = receipt.events?.filter(evt => evt.event === 'Submission' || evt.event === 'Confirmation')
        if (submissionEvents) { 
            if (submissionEvents.length > 0) {
                return (submissionEvents[0]?.args as any).hash       
            }
        } 
        throw new Error(ERROR_NO_SUBMISSION_FOUND)
    }
    
    private static _makeMultiSigTransaction(rawInput: { 0: string, 1: string; 2: string; 3: boolean; 4: ethers.utils.BigNumber }): MultiSigTransaction {
        return {
            hash: rawInput[0],
            data: rawInput[1],
            destination: rawInput[2],
            executed: rawInput[3],
            timestamp: rawInput[4],
        } 
    }
    
    public async getTransactions(): Promise<MultiSigTransaction[]> {
        const transactions: MultiSigTransaction[] = []
        const transactionCount = (await this._contract.transactionCount()).toNumber()
        for (let i = 0; i < transactionCount; i ++ ) {
            const transaction = MultiSigController._makeMultiSigTransaction(await this._contract.getTransactionByIdx(i))
            transactions.push(transaction)
        }
        return transactions
    }
    
    public async getConfirmations(hash: string): Promise<string[]> {
        return this._contract.getConfirmations(hash)
    }
    
    public async getTransaction(hash: string): Promise<MultiSigTransaction> {
        return MultiSigController._makeMultiSigTransaction(await this._contract.getTransaction(hash))
    }     
    
    public async isaMemberOfMultiSig(addr: string): Promise<boolean> {
        const owners = await this._contract.getOwners()
        if (!owners.includes(addr)) {
            return false
        } else {
            return true
        }
    }

    
    public static decodeParams(data: any, abi: any) {
        abiDecoder.addABI(abi);
        return abiDecoder.decodeMethod(data);
    }
    
    //TODO: Move this out
    public static  decodeDealRoomTransaction(encoded: string): any {
        //Identify the method and parameters
        return MultiSigController.decodeParams(encoded, DealRoomCompiled.abi)   
    }
    
    //TODO: Move this out
    public static decodeMultiSigTransaction(encoded: string): any {
        //Identify the method and parameters
        return  MultiSigController.decodeParams(encoded, MultiSigCompiled.abi)   
    }
    
}








