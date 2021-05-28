import { BigNumber, ContractReceipt, Signer } from "ethers";
export declare const ERROR_MULTIPLE_SUBMISSION_EVENTS = "MULTIPLE_SUBMISSION_EVENTS";
export declare const ERROR_NO_SUBMISSION_FOUND = "NO_SUBMISSION_FOUND";
export declare const ERROR_NO_SUBMISSION_HASH_FOUND = "ERROR_NO_SUBMISSION_HASH_FOUND";
export declare const ERROR_NOT_MULTISIG_OWNER = "NOT_MULTISIG_OWNER";
export declare type MultiSigTransaction = {
    hash: string;
    data: string;
    destination: string;
    executed: boolean;
    timestamp: BigNumber;
};
export declare class MultiSigController {
    private _signer;
    private _address?;
    private _contract?;
    private _signerAddress?;
    constructor(multiSigAddress: string, signer: Signer);
    init(): Promise<void>;
    makeHash(destinationAddress: string, abi: any, fnName: string, params: any[]): Promise<string>;
    submitMultiSigTransaction(destinationAddress: string, abi: any, fnName: string, params: any[]): Promise<string>;
    submitDuplexMultiSigProposal(secondaryMultiSigContract: string, destinationAddress: string, destinationAbi: any, destinationFnName: string, destinationParams: any[]): Promise<string>;
    static getSubmissionHash(receipt: ContractReceipt): string;
    private static _makeMultiSigTransaction;
    getTransactions(): Promise<MultiSigTransaction[]>;
    getConfirmations(hash: string): Promise<string[]>;
    getTransaction(hash: string): Promise<MultiSigTransaction>;
    isaMemberOfMultiSig(addr: string): Promise<boolean>;
    static decodeParams(data: any, abi: any): any;
    static decodeDealRoomTransaction(encoded: string): any;
    static decodeMultiSigTransaction(encoded: string): any;
}
