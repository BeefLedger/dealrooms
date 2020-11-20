import { BigNumber } from "ethers/utils"
import { JsonRpcProvider, JsonRpcSigner } from "ethers/providers"

import { deployMultisig, deployTestContract } from "../../ethereum/deploy/deploy"
import { TESTRPC_ACCOUNTS } from "../../lib/settings"
import { MultiSigController } from "../multiSigController"
import { getProvider } from "../../services/chain/providerFactory"

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
let signer1MultiSig: MultiSigController
let signer2MultiSig: MultiSigController

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


})