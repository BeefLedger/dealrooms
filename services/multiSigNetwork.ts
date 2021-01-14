import { Signer } from "ethers"

export type MultiSigNetworkTemplate = {
    name: string
    nodes: Array<MultiSigNetworkNode>
}

enum MultiSigNodeType {
    Person = 'Person',
    Device = 'Device',
    MultiSig = 'MultiSig',
    Contract = 'Contract'
}

type MultiSigNetworkNodeBase = {
    __type: MultiSigNodeType
    id: string
    address?: string
}
type MultiSigNetworkPerson = MultiSigNetworkNodeBase
type MultiSigNetworkDevice = MultiSigNetworkNodeBase
type MultiSigNetworkContract = MultiSigNetworkNodeBase
type MultiSigNetworkMultiSig = MultiSigNetworkNodeBase & {
    owners: string[]
    requiredSignatures: number
    transaction: MultiSigTransaction
}

type MultiSigNetworkNode = MultiSigNetworkContract | MultiSigNetworkMultiSig | MultiSigNetworkPerson | MultiSigNetworkDevice

type MultiSigTransaction = {
    destination: string
    action: MultiSigTransactionAction
}

enum MultiSigTransactionAction {
    Sign = 'Sign',
    Call = 'Call',
}

export class MultiSigNetwork {

    private template: MultiSigNetworkTemplate
    private nodes: MultiSigNetworkNode[]

    constructor() {

    }

    public async deploy(): Promise<void> {
        //For each node, 
        //deploy the corresponding contract
        //and add the address to the template
        //calculate the transaction contents
    }

    // Output to a configuration file
    public serialise(): string  {
        return ""
    }

    public load(s: string) {
        this.template = this._stringToTemplate(s)
    }

    private _stringToTemplate(s: string): MultiSigNetworkTemplate {

        const json: MultiSigNetworkTemplate = JSON.parse(s)
        if (!json.name) {
            throw new Error("Missing name property")
        }
        if (!json.nodes) {
            throw new Error("Missing nodes property")
        }

        const nodes: MultiSigNetworkNode[] = json.nodes.map((node: MultiSigNetworkNodeBase) => {
            if (!node.__type) {
                throw new Error("Missing node __type property")
            }
            if (!node.id) {
                throw new Error("Missing node id property")
            }
            switch (node.__type) {
                case MultiSigNodeType.Contract: {
                    return node as MultiSigNetworkContract
                }
                case MultiSigNodeType.MultiSig: {
                    return node as MultiSigNetworkMultiSig

                }
                case MultiSigNodeType.Person: {
                    return node as MultiSigNetworkPerson
                }
                case MultiSigNodeType.Device: {
                    return node as MultiSigNetworkDevice
                }
            }
        })
        return {
            name: json.name,
            nodes
        } as MultiSigNetworkTemplate
    }

    public getNode(id: string): MultiSigNetworkNode {
        const node = this.nodes.find((item=>item.id === id))
        if (!node) {
            throw new Error("Node not found")
        }
        return node
    }

    // Look up node and sign it, triggering a transaction
    public async signNode(nodeId: string, signer: Signer): Promise<void> {

        const node = this.getNode(id);

        throw new Error("Not implemented")
    }
}