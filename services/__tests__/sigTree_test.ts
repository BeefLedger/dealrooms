
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
let testContract: TestContract
let sigTree: SigTree
let configJson: any

describe("SigTree", () => {
    beforeAll(async ()=> {       
        provider = getProvider()
        signer1 = provider.getSigner(TESTRPC_ACCOUNTS[0].address)
        testContract = await deployTestContract(signer1)
        configJson = fs.readFileSync("./services/__tests__/sigTree.json", {encoding: "utf-8"})

    }, 10000)

/*    it("Import invalid SigTree config", async () =>
    {
        sigTree = new SigTree(signer1)
        const config = JSON.parse(configJson)

        const err = sigTree.load(config)
        expect(err).toBeDefined()
    })
*/
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
        const err = sigTree.load(config)
        expect(err).toBeUndefined()
    })

    it("Deploy", async () => {
        await sigTree.deploy(signer1, provider)
        expect(sigTree.getNode('multisig.agents').address).toBeDefined()
        sigTree.calculateTransactions()
        
    })

    it("Calculate transactions", async () => {
        sigTree.calculateTransactions()
        const node = sigTree.getSigTreeNode('multisig.agents')
        expect(node).toBeDefined()
        expect(node.transaction.encodedData).toBeDefined()

    })
})


