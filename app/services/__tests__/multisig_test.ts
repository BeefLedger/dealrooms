import { BigNumber } from "ethers/utils"
import { JsonRpcProvider, JsonRpcSigner } from "ethers/providers"

import { deployMultisig, deployTestContract } from "../../ethereum/deploy/deploy"
import { TESTRPC_ACCOUNTS } from "../../lib/settings"
import { MultiSigController } from "../multiSigController"
import { getProvider } from "../../services/chain/providerFactory"
import { getContract } from "../../services/chain/contractFactory"

import { MultiSigHashed } from "../../ethereum/types/MultiSigHashed"
import { TestContract } from "../../ethereum/types/TestContract"
import * as TestContractCompiled from "../../ethereum/abi/TestContract.json"

let provider: JsonRpcProvider
let signer1: JsonRpcSigner
let signer2: JsonRpcSigner
let multiSig: MultiSigHashed
let testContract: TestContract
let hash: string
let multiSigAddress: string
/*
describe("Single-layer Multisig", () => {
    beforeAll(async ()=> {       
        provider = getProvider()
        signer1 = provider.getSigner(TESTRPC_ACCOUNTS[3].address)
        signer2 = provider.getSigner(TESTRPC_ACCOUNTS[4].address)
        testContract = await deployTestContract(signer1)

    }, 10000)

    it("Deploy multisig", async () =>
    {
        multiSig = await deployMultisig(
            [
                TESTRPC_ACCOUNTS[3].address,
                TESTRPC_ACCOUNTS[4].address
            ],
            2,
            signer1
        )
        multiSigAddress = multiSig.address
        signer1MultiSig = new MultiSigController(multiSigAddress, signer1)
        signer2MultiSig = new MultiSigController(multiSigAddress, signer2)
        await signer1MultiSig.init()
        await signer2MultiSig.init()
        expect(multiSig).toBeDefined()
    }, 10000)

    it("Submit transaction to multisig", async () => {
        hash = await signer1MultiSig.submitMultiSigTransaction(
            testContract.address,
            TestContractCompiled.abi,
            "doSomethingInt",
            [new BigNumber(100)],

        )        
        expect(hash).toBeDefined()

        let retrievedTransaction = await signer1MultiSig.getTransaction(hash)
        let fnCall = MultiSigController.decodeParams(retrievedTransaction.data, TestContractCompiled.abi)  
        
        expect(retrievedTransaction.destination).toEqual(testContract.address)
        console.log(JSON.stringify(fnCall, undefined, 4))
        expect(fnCall.name === "doSomethingInt")
        expect(Number(fnCall.params[0].value) == 100)

        let confirmations = await signer1MultiSig.getConfirmations(hash)
        console.log(`Confirmations: ${JSON.stringify(confirmations, undefined, 4)}`)
        expect(confirmations).toHaveLength(1)
    })

    it("Second signature", async () => {
        let hash2 = await signer2MultiSig.submitMultiSigTransaction(
            testContract.address,
            TestContractCompiled.abi,
            "doSomethingInt",
            [new BigNumber(100)],
        )  
        expect (hash).toEqual(hash2)
        let confirmations = await signer2MultiSig.getConfirmations(hash)
        expect(confirmations).toHaveLength(2)
    })

    it("Transaction executed", async () => {
        //testContract = getContract(testContract.address, MultiSigHashedCompiled.abi, signerIdxOrAddressOrSigner)
        const result = await testContract.getSomethingInt()
        expect(Number(result)).toEqual(100)
    })
})
*/
let signer3: JsonRpcSigner
let signer4: JsonRpcSigner
let signer5: JsonRpcSigner
let signer1MultiSig: MultiSigController
let signer2MultiSig: MultiSigController
let signer3MultiSig1: MultiSigController
let signer4MultiSig1: MultiSigController
let signer5MultiSig2: MultiSigController
let multiSig1: MultiSigHashed
let multiSig2: MultiSigHashed

describe("Double-layer Multisig", () => {
    beforeAll(async ()=> {       
        provider = getProvider()
        signer3 = provider.getSigner(TESTRPC_ACCOUNTS[3].address)
        signer4 = provider.getSigner(TESTRPC_ACCOUNTS[4].address)
        signer5 = provider.getSigner(TESTRPC_ACCOUNTS[5].address)
        testContract = await deployTestContract(signer3)

    }, 10000)

    it("Deploy multisig 1 and 2", async () =>
    {
        expect(1).toEqual(1)
        multiSig1 = await deployMultisig(
            [
                TESTRPC_ACCOUNTS[3].address,
                TESTRPC_ACCOUNTS[4].address
            ],
            2,
            signer3
        )
        signer3MultiSig1 = new MultiSigController(multiSig1.address, signer3)
        signer4MultiSig1 = new MultiSigController(multiSig1.address, signer4)
        await signer3MultiSig1.init()
        await signer4MultiSig1.init()

        multiSig2 = await deployMultisig(
            [
                TESTRPC_ACCOUNTS[5].address,
                multiSig1.address
            ],
            2,
            signer5
        )
        expect(multiSig2).toBeDefined()
        
        signer5MultiSig2 = new MultiSigController(multiSig2.address, signer5)
        await signer5MultiSig2.init()

        
    }, 10000)

    it("Submit duplex transaction to multisig 1", async () => {
        hash = await signer3MultiSig1.submitDuplexMultiSigProposal(
            multiSig2.address,
            testContract.address,
            TestContractCompiled.abi,
            "doSomethingInt",
            [new BigNumber(500)],
        )        
        expect(hash).toBeDefined()

        let retrievedTransaction = await signer3MultiSig1.getTransaction(hash)
        let fnCall = MultiSigController.decodeMultiSigTransaction(retrievedTransaction.data)  
        
        expect(retrievedTransaction.destination).toEqual(multiSig2.address)
        console.log(JSON.stringify(fnCall, undefined, 4))
        expect(fnCall.name === "submitTransaction")

        let confirmations = await signer3MultiSig1.getConfirmations(hash)
        console.log(`Confirmations: ${JSON.stringify(confirmations, undefined, 4)}`)
        expect(confirmations).toHaveLength(1)
    })

    it("Second signature on contract 1", async () => {

        let transactions = await signer5MultiSig2.getTransactions()
        console.log("TRANSACTIONS BEFORE SECOND SIG", JSON.stringify(transactions, undefined, 4))
        let confirmations = await signer4MultiSig1.getConfirmations(hash)

        hash = await signer4MultiSig1.submitDuplexMultiSigProposal(
            multiSig2.address,
            testContract.address,
            TestContractCompiled.abi,
            "doSomethingInt",
            [new BigNumber(500)],
        )        
        expect(hash).toBeDefined()

        expect(confirmations).toHaveLength(2)
    })

    it("Final signature on contract 2", async () => {
        //Find out what the hash on contract 2 should be
        const expectedHash = await signer5MultiSig2.makeHash(            
            testContract.address,
            TestContractCompiled.abi,
            "doSomethingInt",
            [new BigNumber(500)]
        )
        console.log("EXPECTED HASH", `${expectedHash}`)

        let transactions = await signer5MultiSig2.getTransactions()
        console.log("TRANSACTIONS AFTER SECOND SIG", JSON.stringify(transactions, undefined, 4))
        let confirmations2 = await signer5MultiSig2.getConfirmations(expectedHash)
        console.log(`CONFIRMATIONS for ${expectedHash}`, JSON.stringify(confirmations2, undefined, 4))
        expect(confirmations2).toHaveLength(1)
        hash = await signer5MultiSig2.submitMultiSigTransaction(
            testContract.address,
            TestContractCompiled.abi,
            "doSomethingInt",
            [new BigNumber(500)],
        )  
        expect(hash).toEqual(expectedHash)      
        expect(hash).toBeDefined()
        confirmations2 = await signer5MultiSig2.getConfirmations(expectedHash)
        expect(confirmations2).toHaveLength(2)
    })

    it("Transaction executed", async () => {
        //testContract = getContract(testContract.address, MultiSigHashedCompiled.abi, signerIdxOrAddressOrSigner)
        const result = await testContract.getSomethingInt()
        expect(Number(result)).toEqual(500)
    })

})


