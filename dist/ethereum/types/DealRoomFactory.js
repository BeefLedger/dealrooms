/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */
import { Contract, ContractFactory } from "@ethersproject/contracts";
export class DealRoomFactory extends ContractFactory {
    constructor(signer) {
        super(_abi, _bytecode, signer);
    }
    deploy(_buyer, _seller, overrides) {
        return super.deploy(_buyer, _seller, overrides || {});
    }
    getDeployTransaction(_buyer, _seller, overrides) {
        return super.getDeployTransaction(_buyer, _seller, overrides || {});
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
                internalType: "address",
                name: "_buyer",
                type: "address"
            },
            {
                internalType: "address",
                name: "_seller",
                type: "address"
            }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "message",
                type: "bytes32"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "num",
                type: "uint256"
            }
        ],
        name: "Debug",
        type: "event"
    },
    {
        inputs: [],
        name: "buyer",
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
        name: "creator",
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
        name: "dealCount",
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
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "deals",
        outputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256"
            },
            {
                internalType: "contract IERC20",
                name: "erc20",
                type: "address"
            },
            {
                internalType: "contract IERC721",
                name: "erc721",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "price",
                type: "uint256"
            },
            {
                internalType: "enum DealRoom.DealStatus",
                name: "status",
                type: "uint8"
            },
            {
                internalType: "bool",
                name: "valid",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "erc20",
        outputs: [
            {
                internalType: "contract IERC20",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "erc721",
        outputs: [
            {
                internalType: "contract IERC721",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "owner",
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
        name: "seller",
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
        inputs: [
            {
                internalType: "contract IERC20",
                name: "_erc20",
                type: "address"
            },
            {
                internalType: "contract IERC721",
                name: "_erc721",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "_price",
                type: "uint256"
            },
            {
                internalType: "uint256[]",
                name: "_assetItems",
                type: "uint256[]"
            }
        ],
        name: "makeDeal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256"
            }
        ],
        name: "missingDealAssets",
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
                internalType: "uint256",
                name: "id",
                type: "uint256"
            }
        ],
        name: "missingDealCoins",
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
                internalType: "uint256",
                name: "id",
                type: "uint256"
            }
        ],
        name: "settle",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "dealId",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "count",
                type: "uint256"
            }
        ],
        name: "withdrawDealAssets",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "dealId",
                type: "uint256"
            }
        ],
        name: "withdrawDealCoins",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "getOwner",
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
        name: "getBuyer",
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
        name: "getSeller",
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
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address"
            }
        ],
        name: "changeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256"
            }
        ],
        name: "getDeal",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "id",
                        type: "uint256"
                    },
                    {
                        internalType: "contract IERC20",
                        name: "erc20",
                        type: "address"
                    },
                    {
                        internalType: "contract IERC721",
                        name: "erc721",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "price",
                        type: "uint256"
                    },
                    {
                        internalType: "uint256[]",
                        name: "assetItems",
                        type: "uint256[]"
                    },
                    {
                        internalType: "enum DealRoom.DealStatus",
                        name: "status",
                        type: "uint8"
                    },
                    {
                        internalType: "bool",
                        name: "valid",
                        type: "bool"
                    }
                ],
                internalType: "struct DealRoom.Deal",
                name: "",
                type: "tuple"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getDealCount",
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
                internalType: "uint256",
                name: "id",
                type: "uint256"
            }
        ],
        name: "getDealStatus",
        outputs: [
            {
                internalType: "enum DealRoom.DealStatus",
                name: "",
                type: "uint8"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
const _bytecode = "0x608060405234801561001057600080fd5b5060405161161138038061161183398101604081905261002f9161008d565b600680546001600160a01b0393841661010002610100600160a81b031990911617905560078054919092166001600160a01b0319918216179091556000600481905560018054831633908117909155815490921690911790556100de565b6000806040838503121561009f578182fd5b82516100aa816100c6565b60208401519092506100bb816100c6565b809150509250929050565b6001600160a01b03811681146100db57600080fd5b50565b611524806100ed6000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c806382fd5bac116100b8578063a6f9dae11161007c578063a6f9dae114610245578063a719e10314610258578063bca6ce641461026b578063c698f53b14610273578063dbd0e1b614610293578063eadb3c9c1461029b57610137565b806382fd5bac146101ef578063893d20e81461020f5780638da5cb5b146102175780638df828001461021f5780639056b9721461023257610137565b80634a3a8383116100ff5780634a3a8383146101bc5780634d2d2c9d146101c4578063603daf9a146101d75780637150d8ae146101df578063785e9e86146101e757610137565b806302d05d3f1461013c57806303988f841461015a57806308551a531461017f5780633f35253a14610187578063442d04ee146101a7575b600080fd5b6101446102a3565b60405161015191906111dc565b60405180910390f35b61016d610168366004611177565b6102b2565b6040516101519695949392919061143f565b610144610307565b61019a610195366004611177565b610316565b6040516101519190611436565b6101ba6101b53660046110b3565b610499565b005b61019a6105bc565b61019a6101d2366004611177565b6105c2565b610144610772565b610144610786565b61014461079a565b6102026101fd366004611177565b6107a9565b6040516101519190611383565b6101446108a2565b6101446108b1565b6101ba61022d366004611177565b6108c0565b6101ba610240366004611177565b610989565b6101ba610253366004611054565b610b38565b6101ba6102663660046111a7565b610b84565b610144610e06565b610286610281366004611177565b610e15565b604051610151919061122d565b610144610ecc565b61019a610edb565b6000546001600160a01b031681565b600581815481106102bf57fe5b6000918252602090912060069091020180546001820154600283015460038401546005909401549294506001600160a01b039182169391169160ff8082169161010090041686565b6007546001600160a01b031681565b6000816001610323610fb8565b61032c836107a9565b90508115158160c0015115151482610367576040518060400160405280600b81526020016a4445414c5f45584953545360a81b81525061038f565b6040518060400160405280600e81526020016d1111505317d393d517d193d5539160921b8152505b906103b65760405162461bcd60e51b81526004016103ad9190611242565b60405180910390fd5b506103bf610fb8565b6103c8866107a9565b905060038160a0015160038111156103dc57fe5b14156103ec576000945050610491565b60208101516040516370a0823160e01b81526000916001600160a01b0316906370a082319061041f9030906004016111dc565b60206040518083038186803b15801561043757600080fd5b505afa15801561044b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061046f919061118f565b90508160600151811061048757600095505050610491565b6060909101510393505b505050919050565b60056040518060e001604052806004548152602001866001600160a01b03168152602001856001600160a01b03168152602001848152602001838152602001600160038111156104e557fe5b8152600160209182018190528354808201855560009485529382902083516006909502019384558282015190840180546001600160a01b039283166001600160a01b031991821617909155604084015160028601805491909316911617905560608201516003840155608082015180519293926105689260048501920190610ff4565b5060a082015160058201805460ff1916600183600381111561058657fe5b021790555060c09190910151600590910180549115156101000261ff001990921691909117905550506004805460010190555050565b60045490565b60008160016105cf610fb8565b6105d8836107a9565b90508115158160c0015115151482610613576040518060400160405280600b81526020016a4445414c5f45584953545360a81b81525061063b565b6040518060400160405280600e81526020016d1111505317d393d517d193d5539160921b8152505b906106595760405162461bcd60e51b81526004016103ad9190611242565b50610662610fb8565b61066b866107a9565b905060038160a00151600381111561067f57fe5b141561068f576000945050610491565b6000805b82608001515181101561075f57306001600160a01b031683604001516001600160a01b0316636352211e856080015184815181106106cd57fe5b60200260200101516040518263ffffffff1660e01b81526004016106f19190611436565b60206040518083038186803b15801561070957600080fd5b505afa15801561071d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107419190611077565b6001600160a01b03161415610757576001909101905b600101610693565b5060809091015151039350505050919050565b60065461010090046001600160a01b031690565b60065461010090046001600160a01b031681565b6003546001600160a01b031681565b6107b1610fb8565b600582815481106107be57fe5b60009182526020918290206040805160e08101825260069093029091018054835260018101546001600160a01b039081168486015260028201541683830152600381015460608401526004810180548351818702810187019094528084529394919360808601939283018282801561085557602002820191906000526020600020905b815481526020019060010190808311610841575b5050509183525050600582015460209091019060ff16600381111561087657fe5b600381111561088157fe5b815260059190910154610100900460ff16151560209091015290505b919050565b6001546001600160a01b031690565b6001546001600160a01b031681565b806108c9610fb8565b6108d2826107a9565b905060018160a0015160038111156108e657fe5b146109035760405162461bcd60e51b81526004016103ad90611295565b6001546001600160a01b0316331461092d5760405162461bcd60e51b81526004016103ad90611332565b610936836105c2565b156109535760405162461bcd60e51b81526004016103ad90611356565b61095c83610316565b156109795760405162461bcd60e51b81526004016103ad90611305565b610984836003610ee1565b505050565b806001610994610fb8565b61099d836107a9565b90508115158160c00151151514826109d8576040518060400160405280600b81526020016a4445414c5f45584953545360a81b815250610a00565b6040518060400160405280600e81526020016d1111505317d393d517d193d5539160921b8152505b90610a1e5760405162461bcd60e51b81526004016103ad9190611242565b50610a27610fb8565b610a30856107a9565b905060038160a001516003811115610a4457fe5b1415610a79576007546001600160a01b03163314610a745760405162461bcd60e51b81526004016103ad906112bc565b610aa8565b60065461010090046001600160a01b03163314610aa85760405162461bcd60e51b81526004016103ad906112e1565b80602001516001600160a01b031663a9059cbb3383606001516040518363ffffffff1660e01b8152600401610ade9291906111f0565b602060405180830381600087803b158015610af857600080fd5b505af1158015610b0c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b309190611093565b505050505050565b6001546001600160a01b03163314610b625760405162461bcd60e51b81526004016103ad90611332565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b816001610b8f610fb8565b610b98836107a9565b90508115158160c0015115151482610bd3576040518060400160405280600b81526020016a4445414c5f45584953545360a81b815250610bfb565b6040518060400160405280600e81526020016d1111505317d393d517d193d5539160921b8152505b90610c195760405162461bcd60e51b81526004016103ad9190611242565b50610c22610fb8565b610c2b866107a9565b9050600060038260a001516003811115610c4157fe5b1415610c7b5760065461010090046001600160a01b03163314610c765760405162461bcd60e51b81526004016103ad906112e1565b610ca5565b6007546001600160a01b03163314610ca55760405162461bcd60e51b81526004016103ad906112bc565b60005b826080015151811015610dfc578682108015610d6b5750306001600160a01b031683604001516001600160a01b0316636352211e85608001518481518110610cec57fe5b60200260200101516040518263ffffffff1660e01b8152600401610d109190611436565b60206040518083038186803b158015610d2857600080fd5b505afa158015610d3c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d609190611077565b6001600160a01b0316145b15610df45782604001516001600160a01b03166323b872dd303386608001518581518110610d9557fe5b60200260200101516040518463ffffffff1660e01b8152600401610dbb93929190611209565b600060405180830381600087803b158015610dd557600080fd5b505af1158015610de9573d6000803e3d6000fd5b505060019093019250505b600101610ca8565b5050505050505050565b6002546001600160a01b031681565b6000816001610e22610fb8565b610e2b836107a9565b90508115158160c0015115151482610e66576040518060400160405280600b81526020016a4445414c5f45584953545360a81b815250610e8e565b6040518060400160405280600e81526020016d1111505317d393d517d193d5539160921b8152505b90610eac5760405162461bcd60e51b81526004016103ad9190611242565b50610eb5610fb8565b610ebe866107a9565b60a001519695505050505050565b6007546001600160a01b031690565b60045481565b816001610eec610fb8565b610ef5836107a9565b90508115158160c0015115151482610f30576040518060400160405280600b81526020016a4445414c5f45584953545360a81b815250610f58565b6040518060400160405280600e81526020016d1111505317d393d517d193d5539160921b8152505b90610f765760405162461bcd60e51b81526004016103ad9190611242565b508360058681548110610f8557fe5b60009182526020909120600560069092020101805460ff19166001836003811115610fac57fe5b02179055505050505050565b6040805160e081018252600080825260208201819052918101829052606080820183905260808201529060a08201908152600060209091015290565b82805482825590600052602060002090810192821561102f579160200282015b8281111561102f578251825591602001919060010190611014565b5061103b92915061103f565b5090565b5b8082111561103b5760008155600101611040565b600060208284031215611065578081fd5b8135611070816114d6565b9392505050565b600060208284031215611088578081fd5b8151611070816114d6565b6000602082840312156110a4578081fd5b81518015158114611070578182fd5b600080600080608085870312156110c8578283fd5b84356110d3816114d6565b93506020858101356110e4816114d6565b935060408601359250606086013567ffffffffffffffff811115611106578283fd5b8601601f81018813611116578283fd5b8035611129611124826114ab565b611484565b81815283810190838501858402850186018c1015611145578687fd5b8694505b83851015611167578035835260019490940193918501918501611149565b50979a9699509497505050505050565b600060208284031215611188578081fd5b5035919050565b6000602082840312156111a0578081fd5b5051919050565b600080604083850312156111b9578182fd5b50508035926020909101359150565b15159052565b600481106111d857fe5b9052565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6020810161123a836114cb565b825292915050565b6000602080835283518082850152825b8181101561126e57858101830151858201604001528201611252565b8181111561127f5783604083870101525b50601f01601f1916929092016040019392505050565b6020808252600d908201526c2222a0a62fa727aa2fa7a822a760991b604082015260600190565b6020808252600b908201526a53454c4c45525f4f4e4c5960a81b604082015260600190565b6020808252600a908201526942555945525f4f4e4c5960b01b604082015260600190565b6020808252601390820152724445414c5f544f4b454e535f4d495353494e4760681b604082015260600190565b6020808252600a908201526927a7262cafa7aba722a960b11b604082015260600190565b6020808252601390820152724445414c5f4153534554535f4d495353494e4760681b604082015260600190565b6020808252825182820152828101516001600160a01b039081166040808501919091528401511660608084019190915283015160808084019190915283015160e060a0840152805161010084018190526000929182019083906101208601905b8083101561140357835182529284019260019290920191908401906113e3565b5060a0870151935061141860c08701856111ce565b60c0870151935061142c60e08701856111c8565b9695505050505050565b90815260200190565b8681526001600160a01b038681166020830152851660408201526060810184905260c0810161146d846114cb565b608083015291151560a09091015295945050505050565b60405181810167ffffffffffffffff811182821017156114a357600080fd5b604052919050565b600067ffffffffffffffff8211156114c1578081fd5b5060209081020190565b806004811061089d57fe5b6001600160a01b03811681146114eb57600080fd5b5056fea264697066735822122076b1e239d6fd82b2a03f0399f01c6a95e35048cccc51a9960fa17eb80fec005864736f6c634300060c0033";
