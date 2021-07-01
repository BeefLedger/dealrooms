var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var SigTree = /** @class */ (function () {
    function SigTree(signer) {
        this._signer = signer;
        this._nodes = [];
    }
    // Output to a configuration file
    SigTree.prototype.serialise = function () {
        return JSON.stringify({
            name: this.name,
            nodes: this._nodes
        });
    };
    // Load JSON configuration
    SigTree.prototype.loadJSON = function (s) {
        var data = JSON.parse(s);
        return this.load(data);
    };
    SigTree.prototype.load = function (data) {
        var oldName = this.name;
        var oldNodes = this._nodes;
        try {
            var name_1 = data.name, nodes = data.nodes;
            this.name = name_1;
            this._nodes = nodes;
            var err = this.validate();
            if (err) {
                throw err;
            }
        }
        catch (e) {
            this.name = oldName;
            this._nodes = oldNodes;
            return e;
        }
    };
    //Turn a JSON string into a template
    SigTree.prototype._jsonToTemplate = function (json) {
        if (!json.name) {
            throw new Error("Missing name property");
        }
        if (!json.nodes) {
            throw new Error("Missing nodes property");
        }
        // Process nodes
        var nodes = json.nodes.map(function (node) {
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
            nodes: nodes
        };
    };
    // Check for references to undefined nodes
    // Check that there is just one Contract node, with a valid path to it
    SigTree.prototype.validate = function () {
        var multiSigNodes = this.multiSigNodes();
        for (var _i = 0, multiSigNodes_1 = multiSigNodes; _i < multiSigNodes_1.length; _i++) {
            var node = multiSigNodes_1[_i];
            if (!node.id) {
                return new Error("Missing id for node");
            }
            if (!node.members) {
                return new Error("Missing members for node " + node.id);
            }
            for (var _a = 0, _b = node.members; _a < _b.length; _a++) {
                var member = _b[_a];
                if (!this.getNode(member)) {
                    return new Error("Missing node for " + member);
                }
            }
        }
        if (!this._getContractNode()) {
            return new Error("Missing contract node");
        }
        return null;
    };
    // Return only undeployed multisig nodes
    SigTree.prototype.undeployedMultiSigNodes = function () {
        var nodes = this.multiSigNodes();
        return nodes.filter(function (node) { return node.address === undefined; });
    };
    // Return only multisig nodes
    SigTree.prototype.multiSigNodes = function () {
        return this._nodes.filter(function (node) {
            return node.__type === SigTreeNodeType.MultiSig;
        }).map(function (item) { return item; });
    };
    // Given an id, return a SigTreeNode
    SigTree.prototype.getNode = function (id) {
        return this._nodes.find((function (item) { return item.id === id; }));
    };
    SigTree.prototype.getSigTreeNode = function (id) {
        var node = this.getNode(id);
        if (node.__type === SigTreeNodeType.MultiSig) {
            return node;
        }
        else {
            return undefined;
        }
    };
    // Deploy multisig contact
    SigTree.prototype._deployMultiSigNode = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var memberAddresses, contract;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        memberAddresses = (node.members.map(function (member) {
                            return _this.getNode(member).address;
                        }));
                        return [4 /*yield*/, deployMultisig(memberAddresses, node.requiredSignatures, this._signer)];
                    case 1:
                        contract = _a.sent();
                        node.address = contract.address;
                        return [2 /*return*/];
                }
            });
        });
    };
    SigTree.prototype._getContractNode = function () {
        return this._nodes.find(function (item) { return item.__type === SigTreeNodeType.Contract; });
    };
    // Find the nodes whose destination is nodeId
    SigTree.prototype._getMemberNodes = function (nodeId) {
        return this.multiSigNodes().filter(function (node) { return node.transaction.destination === nodeId; });
    };
    SigTree.prototype.calculateTransactions = function () {
        var contractNode = this._getContractNode();
        if (!contractNode) {
            throw new Error("Missing contract node");
        }
        // Find multisig that calls it
        var triggerMultiSigs = this._getMemberNodes(contractNode.id);
        if (!triggerMultiSigs.length) {
            throw new Error("Missing trigger multisig");
        }
        // There can be only one trigger for the contract node
        var triggerMultiSig = triggerMultiSigs[0];
        // Calculate transaction for contract node
        triggerMultiSig.transaction.encodedData = new ethers.utils.Interface(contractNode.abi).encodeFunctionData(triggerMultiSig.transaction.method, triggerMultiSig.transaction.params);
        //triggerMultiSig.transaction.encodedData = new ethers.utils.Interface(contractNode.abi).functions[triggerMultiSig.transaction.method].encode(triggerMultiSig.transaction.params)
        // Traverse the tree depth-first calculating the encoded transaction data to call "submitTransaction" for each multisig node
        this._calculateMemberNodeTransactions(triggerMultiSig);
    };
    // Recursive function to calculate the transaction data for all nodes above this one
    SigTree.prototype._calculateMemberNodeTransactions = function (node) {
        //Find MultiSig nodes that need to sign this one
        var memberMultiSigs = this._getMemberNodes(node.id);
        if (memberMultiSigs.length === 0) {
            return;
        }
        var encodedData = this._calculateNodeApprovalTransaction(node);
        //Calculate transaction for members to sign and call this function recursively
        for (var _i = 0, memberMultiSigs_1 = memberMultiSigs; _i < memberMultiSigs_1.length; _i++) {
            var memberMultiSig = memberMultiSigs_1[_i];
            memberMultiSig.transaction.encodedData = encodedData;
            this._calculateMemberNodeTransactions(memberMultiSig);
        }
    };
    // Calculate the transaction that others must call to approve me
    SigTree.prototype._calculateNodeApprovalTransaction = function (node) {
        return new ethers.utils.Interface(MultiSigCompiled.abi).encodeFunctionData("submitTransaction", [node.address, 0, node.transaction.encodedData]);
        //return new ethers.utils.Interface(MultiSigCompiled.abi).functions["submitTransaction"].encode([node.address, 0, node.transaction.encodedData])
    };
    // Look up node and sign it, triggering a transaction
    SigTree.prototype.signNode = function (nodeId, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                node = this.getNode(nodeId);
                // Calculate the transaction to send
                throw new Error("Not implemented");
            });
        });
    };
    // Deploy multisig nodes in workable order, skipping nodes until their member multisigs have been deployed
    SigTree.prototype.deploy = function (signer, provider) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, node, readyToDeploy, _b, _c, member, memberNode;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("Deploying tree");
                        console.log("Undeployed: " + this.undeployedMultiSigNodes().length);
                        _d.label = 1;
                    case 1:
                        if (!(this.undeployedMultiSigNodes().length > 0)) return [3 /*break*/, 6];
                        console.log("Undeployed: " + this.undeployedMultiSigNodes().length);
                        _i = 0, _a = this.undeployedMultiSigNodes();
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        node = _a[_i];
                        readyToDeploy = true;
                        for (_b = 0, _c = node.members; _b < _c.length; _b++) {
                            member = _c[_b];
                            memberNode = this.getNode(member);
                            if (!memberNode.address) {
                                readyToDeploy = false;
                                break;
                            }
                        }
                        if (!readyToDeploy) return [3 /*break*/, 4];
                        //Deploy node
                        console.log("Deploying " + node.id + "...");
                        return [4 /*yield*/, this._deployMultiSigNode(node)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return SigTree;
}());
export { SigTree };
