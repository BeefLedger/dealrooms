import { deployMultisig } from "../ethereum/deploy/deploy"
import { ethers, providers, Signer } from "ethers"
import * as MultiSigCompiled from "../ethereum/abi/MultiSigHashed.json"

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
}
export type SigTreeMultiSig = SigTreeNodeBase & {
    members: string[]
    requiredSignatures: number
    transaction: MultiSigTransaction
}

type SigTreeNode = SigTreeContract | SigTreeMultiSig | SigTreePerson | SigTreeDevice

type MultiSigTransaction = {
    destination: string
    method?: string
    params?: string[]
    encodedData?: string
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
    public loadJSON(s: string): Error | undefined {
        const data = JSON.parse(s);
        return this.load(data);
    }

    public load(data: any): Error | undefined {
        const oldName = this.name;
        const oldNodes = this._nodes;
        try {
            const { name, nodes } = data
            this.name = name;
            this._nodes = nodes;
            const err = this.validate()
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
    private validate(): Error | null {
        const multiSigNodes = this.multiSigNodes()
        for (const node of multiSigNodes) {
            if (!node.id) {
                return new Error(`Missing id for node`)
            }
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

    public getSigTreeNode(id: string): SigTreeMultiSig | undefined {
        const node = this.getNode(id);
        if (node.__type === SigTreeNodeType.MultiSig) {
            return node as SigTreeMultiSig
        } else {
            return undefined
        }
    }

    // Deploy multisig contact
    private async _deployMultiSigNode(node: SigTreeMultiSig) {
        const memberAddresses = (node.members.map((member)=> {
            return this.getNode(member).address
        }))
        const contract = await deployMultisig(memberAddresses, node.requiredSignatures, this._signer);
        node.address = contract.address
    }

    private _getContractNode(): SigTreeContract | undefined {
        return this._nodes.find((item)=>item.__type === SigTreeNodeType.Contract) as SigTreeContract
    }

    // Find the nodes whose destination is nodeId
    private _getMemberNodes(nodeId: string): SigTreeMultiSig[] {
    
        return this.multiSigNodes().filter(node => node.transaction.destination === nodeId)
    }

    public calculateTransactions() {
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
        triggerMultiSig.transaction.encodedData = new ethers.utils.Interface(contractNode.abi).encodeFunctionData(triggerMultiSig.transaction.method, triggerMultiSig.transaction.params)
        //triggerMultiSig.transaction.encodedData = new ethers.utils.Interface(contractNode.abi).functions[triggerMultiSig.transaction.method].encode(triggerMultiSig.transaction.params)

        // Traverse the tree depth-first calculating the encoded transaction data to call "submitTransaction" for each multisig node
        this._calculateMemberNodeTransactions(triggerMultiSig)
    }

    // Recursive function to calculate the transaction data for all nodes above this one
    private _calculateMemberNodeTransactions(node: SigTreeMultiSig) {
        //Find MultiSig nodes that need to sign this one
        const memberMultiSigs = this._getMemberNodes(node.id)
        if (memberMultiSigs.length === 0) {
            return
        }
        const encodedData = this._calculateNodeApprovalTransaction(node)
        //Calculate transaction for members to sign and call this function recursively
        for (const memberMultiSig of memberMultiSigs) {
            memberMultiSig.transaction.encodedData = encodedData
            this._calculateMemberNodeTransactions(memberMultiSig)
        }
    }

    // Calculate the transaction that others must call to approve me
    private _calculateNodeApprovalTransaction(node: SigTreeMultiSig): string {
        return new ethers.utils.Interface(MultiSigCompiled.abi).encodeFunctionData("submitTransaction", [node.address, 0, node.transaction.encodedData])
        //return new ethers.utils.Interface(MultiSigCompiled.abi).functions["submitTransaction"].encode([node.address, 0, node.transaction.encodedData])
    }

    // Look up node and sign it, triggering a transaction
    public async signNode(nodeId: string, signer: Signer): Promise<void> {

        const node = this.getNode(nodeId);
        // Calculate the transaction to send

        throw new Error("Not implemented")
    }

    // Deploy multisig nodes in workable order, skipping nodes until their member multisigs have been deployed
    public async deploy(signer: Signer, provider: providers.Provider): Promise<void> {
        console.log("Deploying tree")
        console.log(`Undeployed: ${this.undeployedMultiSigNodes().length}`)
        while (this.undeployedMultiSigNodes().length > 0) {
            console.log(`Undeployed: ${this.undeployedMultiSigNodes().length}`)
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
                    console.log(`Deploying ${node.id}...`)
                    await this._deployMultiSigNode(node);
                }
            }
        }
    }
}