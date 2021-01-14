/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */
import { Contract, ContractFactory } from "ethers";
export class MultiSigHashedFactory extends ContractFactory {
    constructor(signer) {
        super(_abi, _bytecode, signer);
    }
    deploy(_owners, _required, overrides) {
        return super.deploy(_owners, _required, overrides);
    }
    getDeployTransaction(_owners, _required, overrides) {
        return super.getDeployTransaction(_owners, _required, overrides);
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static connect(address, signerOrProvider) {
        return new Contract(address, _abi, signerOrProvider);
    }
}
const _abi = [
    {
        inputs: [
            {
                internalType: "address[]",
                name: "_owners",
                type: "address[]"
            },
            {
                internalType: "uint256",
                name: "_required",
                type: "uint256"
            }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "Confirmation",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256"
            }
        ],
        name: "Deposit",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "Execution",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "ExecutionFailure",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address"
            }
        ],
        name: "OwnerAddition",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address"
            }
        ],
        name: "OwnerRemoval",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "required",
                type: "uint256"
            }
        ],
        name: "RequirementChange",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address"
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "Revocation",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "Submission",
        type: "event"
    },
    {
        stateMutability: "payable",
        type: "fallback"
    },
    {
        inputs: [],
        name: "MAX_OWNER_COUNT",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32"
            },
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        name: "confirmations",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "hashes",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        name: "isOwner",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "owners",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "required",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "transactionCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32"
            }
        ],
        name: "transactions",
        outputs: [
            {
                internalType: "address",
                name: "destination",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256"
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes"
            },
            {
                internalType: "bool",
                name: "executed",
                type: "bool"
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256"
            },
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        stateMutability: "payable",
        type: "receive"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            },
            {
                internalType: "address",
                name: "owner",
                type: "address"
            }
        ],
        name: "ownerHasConfirmed",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address"
            }
        ],
        name: "addOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address"
            }
        ],
        name: "removeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address"
            },
            {
                internalType: "address",
                name: "newOwner",
                type: "address"
            }
        ],
        name: "replaceOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_required",
                type: "uint256"
            }
        ],
        name: "changeRequirement",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "destination",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256"
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes"
            }
        ],
        name: "submitTransaction",
        outputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "confirmTransaction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "revokeConfirmation",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "executeTransaction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "isConfirmed",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "destination",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256"
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes"
            }
        ],
        name: "makeHash",
        outputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        stateMutability: "pure",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "getConfirmationCount",
        outputs: [
            {
                internalType: "uint256",
                name: "count",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getOwners",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "getConfirmations",
        outputs: [
            {
                internalType: "address[]",
                name: "_confirmations",
                type: "address[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32"
            }
        ],
        name: "getTransaction",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32"
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes"
            },
            {
                internalType: "address",
                name: "",
                type: "address"
            },
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "idx",
                type: "uint256"
            }
        ],
        name: "getTransactionByIdx",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32"
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes"
            },
            {
                internalType: "address",
                name: "",
                type: "address"
            },
            {
                internalType: "bool",
                name: "",
                type: "bool"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
const _bytecode = "0x60806040523480156200001157600080fd5b50604051620022c8380380620022c8833981810160405260408110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82518660208202830111640100000000821117156200008c57600080fd5b82525081516020918201928201910280838360005b83811015620000bb578181015183820152602001620000a1565b50505050919091016040525060200151835190925090508160328211801590620000e55750818111155b8015620000f157508015155b8015620000fd57508115155b6200014f576040805162461bcd60e51b815260206004820152601360248201527f696e76616c696420726571756972656d656e7400000000000000000000000000604482015290519081900360640190fd5b60005b84518110156200029757600260008683815181106200016d57fe5b6020908102919091018101516001600160a01b031682528101919091526040016000205460ff1615620001da576040805162461bcd60e51b815260206004820152601060248201526f34b99030b63932b0b23c9037bbb732b960811b604482015290519081900360640190fd5b60006001600160a01b0316858281518110620001f257fe5b60200260200101516001600160a01b0316141562000249576040805162461bcd60e51b815260206004820152600f60248201526e6973206e756c6c206164647265737360881b604482015290519081900360640190fd5b6001600260008784815181106200025c57fe5b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff191691151591909117905560010162000152565b508351620002ad906004906020870190620002ba565b5050506005555062000345565b82805482825590600052602060002090810192821562000312579160200282015b828111156200031257825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190620002db565b506200032092915062000324565b5090565b5b80821115620003205780546001600160a01b031916815560010162000325565b611f7380620003556000396000f3fe60806040526004361061014f5760003560e01c8063969f8a83116100b6578063c64274741161006f578063c642747414610749578063c69ed5f214610811578063d74f8edd1461083b578063dc8452cd14610850578063e20056e614610865578063f3fc536d146108a057610193565b8063969f8a8314610618578063a0e67e2b14610692578063a96bf00c146106a7578063b77bf600146106e0578063ba51a6df146106f5578063bdfd27931461071f57610193565b8063501895ae11610108578063501895ae146103cf578063642f2eaf146103f95780636486aa51146104c95780637065cb48146104f357806379716e4314610526578063915c219e1461055057610193565b8063025e7c27146101d15780630c4ecab414610217578063113642e514610264578063173825d9146102a05780632f54bf6e146102d35780634aae13ca1461030657610193565b366101935734156101915760408051348152905133917fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c919081900360200190a25b005b34156101915760408051348152905133917fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c919081900360200190a2005b3480156101dd57600080fd5b506101fb600480360360208110156101f457600080fd5b50356108ca565b604080516001600160a01b039092168252519081900360200190f35b34801561022357600080fd5b506102506004803603604081101561023a57600080fd5b50803590602001356001600160a01b03166108f1565b604080519115158252519081900360200190f35b34801561027057600080fd5b5061028e6004803603602081101561028757600080fd5b5035610911565b60408051918252519081900360200190f35b3480156102ac57600080fd5b50610191600480360360208110156102c357600080fd5b50356001600160a01b0316610980565b3480156102df57600080fd5b50610250600480360360208110156102f657600080fd5b50356001600160a01b0316610b7b565b34801561031257600080fd5b506103306004803603602081101561032957600080fd5b5035610b90565b6040518086815260200180602001856001600160a01b031681526020018415158152602001838152602001828103825286818151815260200191508051906020019080838360005b83811015610390578181015183820152602001610378565b50505050905090810190601f1680156103bd5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b3480156103db57600080fd5b5061028e600480360360208110156103f257600080fd5b5035610caf565b34801561040557600080fd5b506104236004803603602081101561041c57600080fd5b5035610cc1565b60405180876001600160a01b03168152602001868152602001806020018515158152602001848152602001838152602001828103825286818151815260200191508051906020019080838360005b83811015610489578181015183820152602001610471565b50505050905090810190601f1680156104b65780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b3480156104d557600080fd5b50610250600480360360208110156104ec57600080fd5b5035610d8e565b3480156104ff57600080fd5b506101916004803603602081101561051657600080fd5b50356001600160a01b0316610e15565b34801561053257600080fd5b506101916004803603602081101561054957600080fd5b5035611010565b34801561055c57600080fd5b5061028e6004803603606081101561057357600080fd5b6001600160a01b03823516916020810135918101906060810160408201356401000000008111156105a357600080fd5b8201836020820111156105b557600080fd5b803590602001918460018302840111640100000000831117156105d757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611183945050505050565b34801561062457600080fd5b506106426004803603602081101561063b57600080fd5b5035611198565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561067e578181015183820152602001610666565b505050509050019250505060405180910390f35b34801561069e57600080fd5b5061064261133c565b3480156106b357600080fd5b50610250600480360360408110156106ca57600080fd5b50803590602001356001600160a01b031661139e565b3480156106ec57600080fd5b5061028e6113c9565b34801561070157600080fd5b506101916004803603602081101561071857600080fd5b50356113cf565b34801561072b57600080fd5b506103306004803603602081101561074257600080fd5b50356114c0565b34801561075557600080fd5b5061028e6004803603606081101561076c57600080fd5b6001600160a01b038235169160208101359181019060608101604082013564010000000081111561079c57600080fd5b8201836020820111156107ae57600080fd5b803590602001918460018302840111640100000000831117156107d057600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506115f0945050505050565b34801561081d57600080fd5b506101916004803603602081101561083457600080fd5b50356115fd565b34801561084757600080fd5b5061028e61186e565b34801561085c57600080fd5b5061028e611873565b34801561087157600080fd5b506101916004803603604081101561088857600080fd5b506001600160a01b0381358116916020013516611879565b3480156108ac57600080fd5b50610191600480360360208110156108c357600080fd5b5035611aa3565b600481815481106108d757fe5b6000918252602090912001546001600160a01b0316905081565b600160209081526000928352604080842090915290825290205460ff1681565b6000805b60045481101561097a576000838152600160205260408120600480549192918490811061093e57fe5b60009182526020808320909101546001600160a01b0316835282019290925260400190205460ff1615610972576001820191505b600101610915565b50919050565b3330146109c2576040805162461bcd60e51b815260206004820152600b60248201526a13db9b1e481dd85b1b195d60aa1b604482015290519081900360640190fd5b6001600160a01b038116600090815260026020526040902054819060ff16610a29576040805162461bcd60e51b81526020600482015260156024820152744f776e657220646f6573206e6f742065786973747360581b604482015290519081900360640190fd5b6001600160a01b0382166000908152600260205260408120805460ff191690555b60045460001901811015610afd57826001600160a01b031660048281548110610a6f57fe5b6000918252602090912001546001600160a01b03161415610af557600480546000198101908110610a9c57fe5b600091825260209091200154600480546001600160a01b039092169183908110610ac257fe5b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550610afd565b600101610a4a565b506004805480610b0957fe5b600082815260209020810160001990810180546001600160a01b03191690550190556004546005541115610b4357600454610b43906113cf565b6040516001600160a01b038316907f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b9090600090a25050565b60026020526000908152604090205460ff1681565b600060606000806000610ba1611e66565b60008781526020818152604091829020825160c08101845281546001600160a01b03168152600180830154828501526002808401805487516101009482161594909402600019011691909104601f81018690048602830186018752808352929593949386019391929091830182828015610c5c5780601f10610c3157610100808354040283529160200191610c5c565b820191906000526020600020905b815481529060010190602001808311610c3f57829003601f168201915b5050509183525050600382015460ff1615156020820152600482015460408083019190915260059092015460609182015290820151825191830151608090930151999a9099919850919650945092505050565b60036020526000908152604090205481565b6000602081815291815260409081902080546001808301546002808501805487516101009582161595909502600019011691909104601f81018890048802840188019096528583526001600160a01b0390931695909491929190830182828015610d6c5780601f10610d4157610100808354040283529160200191610d6c565b820191906000526020600020905b815481529060010190602001808311610d4f57829003601f168201915b5050505060038301546004840154600590940154929360ff9091169290915086565b600080805b600454811015610e0d5760008481526001602052604081206004805491929184908110610dbc57fe5b60009182526020808320909101546001600160a01b0316835282019290925260400190205460ff1615610df0576001820191505b600554821415610e0557600192505050610e10565b600101610d93565b50505b919050565b333014610e57576040805162461bcd60e51b815260206004820152600b60248201526a13db9b1e481dd85b1b195d60aa1b604482015290519081900360640190fd5b6001600160a01b038116600090815260026020526040902054819060ff1615610eb6576040805162461bcd60e51b815260206004820152600c60248201526b4f776e65722065786973747360a01b604482015290519081900360640190fd5b816001600160a01b038116610f06576040805162461bcd60e51b81526020600482015260116024820152700e881859191c995cdcc81a5cc81b9d5b1b607a1b604482015290519081900360640190fd5b60048054905060010160055460328211158015610f235750818111155b8015610f2e57508015155b8015610f3957508115155b610f80576040805162461bcd60e51b81526020600482015260136024820152721a5b9d985b1a59081c995c5d5a5c995b595b9d606a1b604482015290519081900360640190fd5b6001600160a01b038516600081815260026020526040808220805460ff1916600190811790915560048054918201815583527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0180546001600160a01b03191684179055517ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d9190a25050505050565b3360008181526002602052604090205460ff1661106c576040805162461bcd60e51b81526020600482015260156024820152744f776e657220646f6573206e6f742065786973747360581b604482015290519081900360640190fd5b8161107681611c13565b6110ba576040805162461bcd60e51b815260206004820152601060248201526f151e08191bd95cdb89dd08195e1a5cdd60821b604482015290519081900360640190fd5b60008381526001602090815260408083203380855292529091205484919060ff1615611126576040805162461bcd60e51b81526020600482015260166024820152750e881a5cc8185b1c9958591e4818dbdb999a5c9b595960521b604482015290519081900360640190fd5b6000858152600160208181526040808420338086529252808420805460ff1916909317909255905187927fe1c52dc63b719ade82e8bea94cc41a0d5d28e4aaf536adb5e9cccc9ff8c1aeda91a361117c856115fd565b5050505050565b6000611190848484611c30565b949350505050565b600454606090819067ffffffffffffffff811180156111b657600080fd5b506040519080825280602002602001820160405280156111e0578160200160208202803683370190505b5090506000805b6004548110156112a3576000858152600160205260408120600480549192918490811061121057fe5b60009182526020808320909101546001600160a01b0316835282019290925260400190205460ff161561129b576004818154811061124a57fe5b9060005260206000200160009054906101000a90046001600160a01b031683838151811061127457fe5b60200260200101906001600160a01b031690816001600160a01b0316815250506001820191505b6001016111e7565b8167ffffffffffffffff811180156112ba57600080fd5b506040519080825280602002602001820160405280156112e4578160200160208202803683370190505b509350600090505b818110156113345782818151811061130057fe5b602002602001015184828151811061131457fe5b6001600160a01b03909216602092830291909101909101526001016112ec565b505050919050565b6060600480548060200260200160405190810160405280929190818152602001828054801561139457602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311611376575b5050505050905090565b60009182526001602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60065481565b333014611411576040805162461bcd60e51b815260206004820152600b60248201526a13db9b1e481dd85b1b195d60aa1b604482015290519081900360640190fd5b60045481603282118015906114265750818111155b801561143157508015155b801561143c57508115155b611483576040805162461bcd60e51b81526020600482015260136024820152721a5b9d985b1a59081c995c5d5a5c995b595b9d606a1b604482015290519081900360640190fd5b60058390556040805184815290517fa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a9181900360200190a1505050565b6000606060008060006114d1611e66565b600087815260036020908152604080832054835282825291829020825160c08101845281546001600160a01b03168152600180830154828501526002808401805487516101009482161594909402600019011691909104601f810186900486028301860187528083529295939493860193919290918301828280156115975780601f1061156c57610100808354040283529160200191611597565b820191906000526020600020905b81548152906001019060200180831161157a57829003601f168201915b5050509183525050600382015460ff1615156020820152600482015460408083019190915260059092015460609182015260a083015191830151835191840151608090940151929b909a50909850919650945092505050565b6000611190848484611cc5565b3360008181526002602052604090205460ff16611659576040805162461bcd60e51b81526020600482015260156024820152744f776e657220646f6573206e6f742065786973747360581b604482015290519081900360640190fd5b60008281526001602090815260408083203380855292529091205483919060ff166116bd576040805162461bcd60e51b815260206004820152600f60248201526e0e881b9bdd0818dbdb999a5c9b5959608a1b604482015290519081900360640190fd5b600084815260208190526040902060030154849060ff161561171e576040805162461bcd60e51b81526020600482015260156024820152740e881d1e08185b1c9958591e48195e1958dd5d1959605a1b604482015290519081900360640190fd5b61172785610d8e565b1561117c576000858152602081815260409182902060038101805460ff19166001908117909155815481830154600280850180548851601f6000199783161561010002979097019091169290920494850187900487028201870190975283815293956117f9956001600160a01b039093169491939283908301828280156117ef5780601f106117c4576101008083540402835291602001916117ef565b820191906000526020600020905b8154815290600101906020018083116117d257829003601f168201915b5050505050611e43565b1561182e5760405186907f7e9e1cb65db4927b1815f498cbaa226a15c277816f7df407573682110522c9b190600090a2611866565b60405186907fdbe42d02a4e07d7eeff2874efe172540c93b297d206f6d691c9782a257323e3290600090a260038101805460ff191690555b505050505050565b603281565b60055481565b3330146118bb576040805162461bcd60e51b815260206004820152600b60248201526a13db9b1e481dd85b1b195d60aa1b604482015290519081900360640190fd5b6001600160a01b038216600090815260026020526040902054829060ff16611922576040805162461bcd60e51b81526020600482015260156024820152744f776e657220646f6573206e6f742065786973747360581b604482015290519081900360640190fd5b6001600160a01b038216600090815260026020526040902054829060ff1615611981576040805162461bcd60e51b815260206004820152600c60248201526b4f776e65722065786973747360a01b604482015290519081900360640190fd5b60005b600454811015611a0957846001600160a01b0316600482815481106119a557fe5b6000918252602090912001546001600160a01b03161415611a015783600482815481106119ce57fe5b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550611a09565b600101611984565b506001600160a01b03808516600081815260026020526040808220805460ff1990811690915593871682528082208054909416600117909355915190917f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b9091a26040516001600160a01b038416907ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d90600090a250505050565b3360008181526002602052604090205460ff16611aff576040805162461bcd60e51b81526020600482015260156024820152744f776e657220646f6573206e6f742065786973747360581b604482015290519081900360640190fd5b60008281526001602090815260408083203380855292529091205483919060ff16611b63576040805162461bcd60e51b815260206004820152600f60248201526e0e881b9bdd0818dbdb999a5c9b5959608a1b604482015290519081900360640190fd5b600084815260208190526040902060030154849060ff1615611bc4576040805162461bcd60e51b81526020600482015260156024820152740e881d1e08185b1c9958591e48195e1958dd5d1959605a1b604482015290519081900360640190fd5b6000858152600160209081526040808320338085529252808320805460ff191690555187927f9aec1a62b961581534d37fd62d35e3648f05a17b1f986eda1d1a9d97b147840691a35050505050565b6000908152602081905260409020546001600160a01b0316151590565b600083838360405160200180846001600160a01b031660601b815260140183815260200182805190602001908083835b60208310611c7f5780518252601f199092019160209182019101611c60565b6001836020036101000a03801982511681845116808217855250505050505090500193505050506040516020818303038152906040528051906020012090509392505050565b6000836001600160a01b038116611d17576040805162461bcd60e51b81526020600482015260116024820152700e881859191c995cdcc81a5cc81b9d5b1b607a1b604482015290519081900360640190fd5b611d22858585611c30565b9150611d2d82611c13565b611e32576040805160c0810182526001600160a01b038781168252602080830188815283850188815260006060860181905242608087015260a0860189905288815280845295909520845181546001600160a01b03191694169390931783555160018301559251805192939192611daa9260028501920190611eaa565b5060608201516003828101805460ff1916921515929092179091556080830151600483015560a090920151600590910155600680546000908152602092909252604090912083905580546001019055611e0282611010565b60405182907f1b15da2a2b1f440c8fb970f04466e7ccd3a8215634645d232bbc23c75785b5bb90600090a2611e3b565b611e3b82611010565b509392505050565b6000806040516020840160008287838a8c6187965a03f198975050505050505050565b6040518060c0016040528060006001600160a01b03168152602001600081526020016060815260200160001515815260200160008152602001600080191681525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611eeb57805160ff1916838001178555611f18565b82800160010185558215611f18579182015b82811115611f18578251825591602001919060010190611efd565b50611f24929150611f28565b5090565b5b80821115611f245760008155600101611f2956fea26469706673582212207f7ac03cdf36d64ee75458844f475a6d806b2eb6adb8736480f3d57bd365789764736f6c634300060c0033";
