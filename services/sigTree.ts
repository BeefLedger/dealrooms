import { deployMultisig } from "../ethereum/deploy/deploy"
import { ethers, Signer } from "ethers"
import { Provider } from "ethers/providers"
import * as MultiSigCompiled from "../ethereum/abi/MultiSigHashed.json"
import { MultiSigController } from "./multiSigController"
import { getMultiSigContract } from "./chain/prefabContractFactory"
import { MultiSigHashed } from "ethereum/types/MultiSigHashed"
import { BigNumber, hashMessage } from "ethers/utils"

export type SigTreeTemplate = {
    name: string
    nodes: Array<SigTreeNode>
}

enum SigTreeNodeType {
    Person = 'Person',
    Device = 'Device',
    MultiSig = 'MultiSig',
    Contract = 'Contract'
}

type SigTreeNodeBase = {
    __type: SigTreeNodeType
    id: string
    address?: string
}
type SigTreePerson = SigTreeNodeBase
type SigTreeDevice = SigTreeNodeBase
type SigTreeContract = SigTreeNodeBase & {
    abi: any
    contract?: MultiSigHashed
}
export type SigTreeMultiSig = SigTreeNodeBase & {
    members: string[]
    requiredSignatures: number
    transaction: MultiSigTransaction //The transaction that will be sent to another contact
    contract?: MultiSigHashed //The instance of the underlying contract
}

type SigTreeNode = SigTreeContract | SigTreeMultiSig | SigTreePerson | SigTreeDevice

type MultiSigTransaction = {
    destination: string
    method?: string
    params?: string[]
    encodedData?: string
    destinationNode: SigTreeNode
    hash?: string
}
export class SigTree {

    private _template: SigTreeTemplate
    private _nodes: SigTreeNode[]
    private _signer: Signer
    public name: string

    constructor(signer: Signer) {
        this._signer = signer
        this._nodes = []
    }

    // Output to a configuration file
    public serialise(): string {
        return JSON.stringify({
            name: this.name,
            nodes: this._nodes
        })
    }

    // Load JSON configuration
    public async loadJSON(s: string):Promise<Error | undefined> {
        const data = JSON.parse(s);
        return await this.load(data);
    }

    public async load(data: any): Promise<Error | undefined> {
        const oldName = this.name;
        const oldNodes = this._nodes;
        try {
            const { name, nodes } = data
            this.name = name;
            this._nodes = nodes;
            const err = await this.validate()
            if (err) {
                throw err
            }
        } 
        catch (e) {
            this.name = oldName;
            this._nodes = oldNodes;
            return e;
        }
    }

    //Turn a JSON string into a template
    private _jsonToTemplate(json: any): SigTreeTemplate {

        if (!json.name) {
            throw new Error("Missing name property")
        }
        if (!json.nodes) {
            throw new Error("Missing nodes property")
        }

        // Process nodes
        const nodes: SigTreeNode[] = json.nodes.map((node: SigTreeNodeBase) => {
            if (!node.__type) {
                throw new Error("Missing node __type property")
            }
            if (!node.id) {
                throw new Error("Missing node id property")
            }
            switch (node.__type) {
                case SigTreeNodeType.Contract: {
                    return node as SigTreeContract
                }
                case SigTreeNodeType.MultiSig: {
                    return node as SigTreeMultiSig

                }
                case SigTreeNodeType.Person: {
                    return node as SigTreePerson
                }
                case SigTreeNodeType.Device: {
                    return node as SigTreeDevice
                }
            }
        })
        return {
            name: json.name,
            nodes
        } as SigTreeTemplate
    }

    // Check for references to undefined nodes
    // Check that there is just one Contract node, with a valid path to it
    private async validate(): Promise<Error | null> {
        const multiSigNodes = this.multiSigNodes()
        for (const node of multiSigNodes) {
            if (!node.id) {
                return new Error(`Missing id for node`)
            }
            
            let destinationNode = this.getNode(node.transaction.destination)
            if (!destinationNode) {
                return new Error(`Missing destination for node ${node.id}`)
            }
            node.transaction.destinationNode = destinationNode

            if (!node.members) {
                return new Error(`Missing members for node ${node.id}`)
            }
            for (const member of node.members) {
                if (!this.getNode(member)) {
                    return new Error(`Missing node for ${member}`)
                }
            }
        }
        if (!this._getContractNode()) {
            return new Error(`Missing contract node`)
        }
        
        return null
    }

    // Return only undeployed multisig nodes
    private undeployedMultiSigNodes(): SigTreeMultiSig[] {
        const nodes = this.multiSigNodes()
        return nodes.filter(node=>node.address === undefined)
    }

    // Return only multisig nodes
    public multiSigNodes(): SigTreeMultiSig[] {
        return this._nodes.filter((node) => {
            return node.__type === SigTreeNodeType.MultiSig
        }).map(item => item as SigTreeMultiSig)
    }

    // Given an id, return a SigTreeNode
    public getNode(id: string): SigTreeNode | undefined {
        return this._nodes.find((item=>item.id === id))
    }

    public getMultiSigNode(id: string): SigTreeMultiSig | undefined {
        const node = this.getNode(id);
        if (!node) {
            throw new Error("Node not found")
        }

        if (node.__type === SigTreeNodeType.MultiSig) {
            return node as SigTreeMultiSig
        } else {
            return undefined
        }
    }

    // Person or device signs a multisig
    public async signMultiSig(signer: Signer, id: string): Promise<string> {
        console.log("** signMultiSig()")
        const node = this.getMultiSigNode(id)
        if (!node) {
            throw new Error("Node not found")
        }
        console.log(`signing ${id}`)

        //const { hash, encodedData } = await this._calculateNodeApprovalTransaction(node.transaction.destinationNode)
        const transaction = await node.contract.submitTransaction(node.transaction.destinationNode.address, 0, node.transaction.encodedData, {gasLimit: new BigNumber("5999999")})
        const receipt = await transaction.wait() 
        //Obtain the transaction ID created in the multisig
        try {
            if (receipt.events) {
                const result = await MultiSigController.getSubmissionHash(receipt)
                /*if (result !== hash) {
                    console.info(`NODE ${node.id}: Mismatched hashes`)
                    console.info(`Input: ${node.transaction.destinationNode.address} ${node.transaction.encodedData}`)
                    console.info(`Result: ${result}`)
                    console.info(`Expecting: ${hash}`)
                }*/
                return result
            }
            throw `No submission events`      
        }
        catch (e) {
            throw `Error getting submission results: ${e}`
        }
    }

    // Deploy multisig contact
    private async _deployMultiSigNode(node: SigTreeMultiSig) {
        const memberAddresses = (node.members.map((member)=> {
            return this.getNode(member).address
        }))
        node.contract = await deployMultisig(memberAddresses, node.requiredSignatures, this._signer);
        node.address = node.contract.address
    }

    private _getContractNode(): SigTreeContract | undefined {
        return this._nodes.find((item)=>item.__type === SigTreeNodeType.Contract) as SigTreeContract
    }

    // Find the nodes whose destination is nodeId
    private _getMemberNodes(nodeId: string): SigTreeMultiSig[] {
    
        return this.multiSigNodes().filter(node => node.transaction.destination === nodeId)
    }

    public async calculateTransactions() {
        const contractNode = this._getContractNode()
        if (!contractNode) {
            throw new Error("Missing contract node")
        }
        // Find multisig that calls it
        let triggerMultiSigs = this._getMemberNodes(contractNode.id)
        if (!triggerMultiSigs.length) {
            throw new Error("Missing trigger multisig")
        }
        // There can be only one trigger for the contract node
        const triggerMultiSig = triggerMultiSigs[0]

        // Calculate transaction for contract node
        triggerMultiSig.transaction.encodedData = new ethers.utils.Interface(contractNode.abi).functions[triggerMultiSig.transaction.method].encode(triggerMultiSig.transaction.params)

        // Traverse the tree depth-first calculating the encoded transaction data to call "submitTransaction" for each multisig node
        await this._calculateMemberNodeTransactions(triggerMultiSig)
    }

    // Recursive function to calculate the transaction data for all nodes above this one
    private async _calculateMemberNodeTransactions(node: SigTreeMultiSig): Promise<void> {
        //Find MultiSig nodes that need to sign this one
        const memberMultiSigs = this._getMemberNodes(node.id)
        if (memberMultiSigs.length === 0) {
            return
        }
        const { encodedData, hash } = await this._calculateNodeApprovalTransaction(node)
        
        //Calculate transaction for members to sign and call this function recursively
        // For each member,
        for (const memberMultiSig of memberMultiSigs) {
            // Pass it the transaction data. All the member nodes will be calling that
            memberMultiSig.transaction.encodedData = encodedData
            memberMultiSig.transaction.hash = hash

            await this._calculateMemberNodeTransactions(memberMultiSig)
        }
    }

    // Calculate the encoded transaction that others must call to approve me
    // TODO: Check this logic
    private async _calculateNodeApprovalTransaction(node: SigTreeMultiSig): Promise<{ encodedData: string, hash: string }> {
        const encodedData = new ethers.utils.Interface(MultiSigCompiled.abi).functions["submitTransaction"].encode([node.transaction.destinationNode.address, 0, node.transaction.encodedData])
        const hash = await node.contract.makeHash(node.transaction.destinationNode.address, 0, node.transaction.encodedData)

        return {
            encodedData,
            hash
        }
    }

    public async signatureCount(nodeId: string): Promise<BigNumber> {
        const node = this.getMultiSigNode(nodeId)
        return await node.contract.getConfirmationCount(node.transaction.hash)
    }

    /*public async myRequiredSignatures(signer: Signer): Promise<SigTreeMultiSig[]> {
        // Return all the nodes I need to sign that I haven't signed
    }*/

    // Deploy multisig nodes in workable order, skipping nodes until their member multisigs have been deployed
    public async deploy(signer: Signer, provider: Provider): Promise<void> {
        while (this.undeployedMultiSigNodes().length > 0) {
            for (const node of this.undeployedMultiSigNodes()) {
                let readyToDeploy = true
                for (const member of node.members) {              
                    const memberNode = this.getNode(member);
                    if (!memberNode.address) {
                        readyToDeploy = false;
                        break;
                    }
                }
                if (readyToDeploy) {
                    //Deploy node
                    await this._deployMultiSigNode(node);
                }
            }
        }
    }
}