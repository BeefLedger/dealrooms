var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { deployMultisig } from "../ethereum/deploy/deploy";
import { ethers } from "ethers";
import * as MultiSigCompiled from "../ethereum/abi/MultiSigHashed.json";
var SigTreeNodeType;
(function (SigTreeNodeType) {
    SigTreeNodeType["Person"] = "Person";
    SigTreeNodeType["Device"] = "Device";
    SigTreeNodeType["MultiSig"] = "MultiSig";
    SigTreeNodeType["Contract"] = "Contract";
})(SigTreeNodeType || (SigTreeNodeType = {}));
export class SigTree {
    constructor(signer) {
        this._signer = signer;
        this._nodes = [];
    }
    // Output to a configuration file
    serialise() {
        return JSON.stringify({
            name: this.name,
            nodes: this._nodes
        });
    }
    // Load JSON configuration
    loadJSON(s) {
        const data = JSON.parse(s);
        return this.load(data);
    }
    load(data) {
        const oldName = this.name;
        const oldNodes = this._nodes;
        try {
            const { name, nodes } = data;
            this.name = name;
            this._nodes = nodes;
            const err = this.validate();
            if (err) {
                throw err;
            }
        }
        catch (e) {
            this.name = oldName;
            this._nodes = oldNodes;
            return e;
        }
    }
    //Turn a JSON string into a template
    _jsonToTemplate(json) {
        if (!json.name) {
            throw new Error("Missing name property");
        }
        if (!json.nodes) {
            throw new Error("Missing nodes property");
        }
        // Process nodes
        const nodes = json.nodes.map((node) => {
            if (!node.__type) {
                throw new Error("Missing node __type property");
            }
            if (!node.id) {
                throw new Error("Missing node id property");
            }
            switch (node.__type) {
                case SigTreeNodeType.Contract: {
                    return node;
                }
                case SigTreeNodeType.MultiSig: {
                    return node;
                }
                case SigTreeNodeType.Person: {
                    return node;
                }
                case SigTreeNodeType.Device: {
                    return node;
                }
            }
        });
        return {
            name: json.name,
            nodes
        };
    }
    // Check for references to undefined nodes
    // Check that there is just one Contract node, with a valid path to it
    validate() {
        const multiSigNodes = this.multiSigNodes();
        for (const node of multiSigNodes) {
            if (!node.id) {
                return new Error(`Missing id for node`);
            }
            if (!node.members) {
                return new Error(`Missing members for node ${node.id}`);
            }
            for (const member of node.members) {
                if (!this.getNode(member)) {
                    return new Error(`Missing node for ${member}`);
                }
            }
        }
        if (!this._getContractNode()) {
            return new Error(`Missing contract node`);
        }
        return null;
    }
    // Return only undeployed multisig nodes
    undeployedMultiSigNodes() {
        const nodes = this.multiSigNodes();
        return nodes.filter(node => node.address === undefined);
    }
    // Return only multisig nodes
    multiSigNodes() {
        return this._nodes.filter((node) => {
            return node.__type === SigTreeNodeType.MultiSig;
        }).map(item => item);
    }
    // Given an id, return a SigTreeNode
    getNode(id) {
        const node = this._nodes.find((item => item.id === id));
        if (!node) {
            return undefined;
        }
        switch (node.__type) {
            case SigTreeNodeType.Contract: {
                return node;
            }
            case SigTreeNodeType.MultiSig: {
                return node;
            }
            case SigTreeNodeType.Person: {
                return node;
            }
            case SigTreeNodeType.Device: {
                return node;
            }
            default: {
                return node;
            }
        }
    }
    getSigTreeNode(id) {
        const node = this.getNode(id);
        if (node.__type === SigTreeNodeType.MultiSig) {
            return node;
        }
    }
    // Deploy multisig contact
    _deployMultiSigNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberAddresses = (node.members.map((member) => {
                return this.getNode(member).address;
            }));
            const contract = yield deployMultisig(memberAddresses, node.requiredSignatures, this._signer);
            node.address = contract.address;
        });
    }
    _getContractNode() {
        return this._nodes.find((item) => item.__type === SigTreeNodeType.Contract);
    }
    // Find the nodes whose destination is nodeId
    _getMemberNodes(nodeId) {
        return this.multiSigNodes().filter(node => node.transaction.destination === nodeId);
    }
    calculateTransactions() {
        const contractNode = this._getContractNode();
        if (!contractNode) {
            throw new Error("Missing contract node");
        }
        // Find multisig that calls it
        let triggerMultiSigs = this._getMemberNodes(contractNode.id);
        if (!triggerMultiSigs.length) {
            throw new Error("Missing trigger multisig");
        }
        // There can be only one trigger for the contract node
        const triggerMultiSig = triggerMultiSigs[0];
        // Calculate transaction for contract node
        triggerMultiSig.transaction.encodedData = new ethers.utils.Interface(contractNode.abi).functions[triggerMultiSig.transaction.method].encode(triggerMultiSig.transaction.params);
        // Traverse the tree depth-first calculating the encoded transaction data to call "submitTransaction" for each multisig node
        this._calculateMemberNodeTransactions(triggerMultiSig);
    }
    // Recursive function to calculate the transaction data for all nodes above this one
    _calculateMemberNodeTransactions(node) {
        //Find MultiSig nodes that need to sign this one
        const memberMultiSigs = this._getMemberNodes(node.id);
        if (memberMultiSigs.length === 0) {
            return;
        }
        const encodedData = this._calculateNodeApprovalTransaction(node);
        //Calculate transaction for members to sign and call this function recursively
        for (const memberMultiSig of memberMultiSigs) {
            memberMultiSig.transaction.encodedData = encodedData;
            this._calculateMemberNodeTransactions(memberMultiSig);
        }
    }
    // Calculate the transaction that others must call to approve me
    _calculateNodeApprovalTransaction(node) {
        return new ethers.utils.Interface(MultiSigCompiled.abi).functions["submitTransaction"].encode([node.address, 0, node.transaction.encodedData]);
    }
    // Look up node and sign it, triggering a transaction
    signNode(nodeId, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = this.getNode(nodeId);
            // Calculate the transaction to send
            throw new Error("Not implemented");
        });
    }
    // Deploy multisig nodes in workable order, skipping nodes until their member multisigs have been deployed
    deploy(signer, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Deploying tree");
            console.log(`Undeployed: ${this.undeployedMultiSigNodes().length}`);
            while (this.undeployedMultiSigNodes().length > 0) {
                console.log(`Undeployed: ${this.undeployedMultiSigNodes().length}`);
                for (const node of this.undeployedMultiSigNodes()) {
                    let readyToDeploy = true;
                    for (const member of node.members) {
                        const memberNode = this.getNode(member);
                        if (!memberNode.address) {
                            readyToDeploy = false;
                            break;
                        }
                    }
                    if (readyToDeploy) {
                        //Deploy node
                        console.log(`Deploying ${node.id}...`);
                        yield this._deployMultiSigNode(node);
                    }
                }
            }
        });
    }
}
