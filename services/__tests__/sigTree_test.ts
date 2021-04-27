
import { JsonRpcProvider, JsonRpcSigner } from "ethers/providers"

import { deployTestContract } from "../../ethereum/deploy/deploy"
import { TESTRPC_ACCOUNTS } from "../../lib/settings"
import { getProvider } from "../../services/chain/providerFactory"


import { TestContract } from "../../ethereum/types/TestContract"
import * as TestContractCompiled from "../../ethereum/abi/TestContract.json"
import { SigTree } from "../../services/sigTree"
import * as fs from "fs"

let provider: JsonRpcProvider
let signer1: JsonRpcSigner
let signerBuyer: JsonRpcSigner
let signerSeller: JsonRpcSigner
let signerAuthor1: JsonRpcSigner
let testContract: TestContract
let sigTree: SigTree
let configJson: any

describe("SigTree", () => {
    beforeAll(async ()=> {       
        provider = getProvider()
        signer1 = provider.getSigner(TESTRPC_ACCOUNTS[0].address)
        signerSeller = provider.getSigner(TESTRPC_ACCOUNTS[5].address)
        signerBuyer = provider.getSigner(TESTRPC_ACCOUNTS[6].address)
        signerAuthor1 = provider.getSigner(TESTRPC_ACCOUNTS[3].address)
        testContract = await deployTestContract(signer1)
        configJson = fs.readFileSync("./services/__tests__/sigTree.json", {encoding: "utf-8"})

    }, 10000)

    it("Import invalid SigTree config", async () =>
    {
        sigTree = new SigTree(signer1)
        const config = JSON.parse(configJson)

        const err = sigTree.load(config)
        expect(err).toBeDefined()
    })

    it("Import valid SigTree config", async () =>
    {
        sigTree = new SigTree(signer1)
        const config = JSON.parse(configJson)
        config.nodes.push({
            "id": "escrow",
            "__type": "Contract",
            "address": testContract.address,
            "abi": TestContractCompiled.abi

        })
        const err = await sigTree.load(config)
        expect(err).toBeUndefined()
    })

    it("Deploy", async () => {
        await sigTree.deploy(signer1, provider)
        expect(sigTree.getNode('multisig.agents').address).toBeDefined()
    })

    it("Calculate transactions", async () => {
        await sigTree.calculateTransactions()
        const node = sigTree.getMultiSigNode('multisig.agents')
        expect(node).toBeDefined()
        expect(node.transaction.encodedData).toBeDefined()
    })

    it("Sign for buyer with wrong signer", async () => {
        let failed = false
        try {
            await sigTree.signMultiSig(signerAuthor1, 'multisig.agents')
        }
        catch (e) {
            failed = true
        }
        expect(failed)

        const count = await sigTree.signatureCount('multisig.agents')
        expect(count.toNumber()).toEqual(0)
    })

    it("Sign for buyer with correct signer", async () => {
        let failed = false
        try {
            await sigTree.signMultiSig(signerBuyer, 'multisig.agents')
        }
        catch (e) {
            failed = true
        }
        expect(!failed)

        let count = await sigTree.signatureCount('multisig.agents')
        expect(count.toNumber()).toEqual(1)

        count = await sigTree.signatureCount('multisig.escrow')
        expect(count.toNumber()).toEqual(0)
    })

    it("Sign for seller", async () => {
        let failed = false
        try {
            await sigTree.signMultiSig(signerSeller, 'multisig.agents')
        }
        catch (e) {
            failed = true
        }
        expect(!failed)

        let count = await sigTree.signatureCount('multisig.agents')
        expect(count.toNumber()).toEqual(2)
        
        count = await sigTree.signatureCount('multisig.escrow')
        expect(count.toNumber()).toEqual(1)
    })

    

})


