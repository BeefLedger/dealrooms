/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import { DealRoom } from "./DealRoom";

export class DealRoomFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _buyer: string,
    _seller: string,
    overrides?: Overrides
  ): Promise<DealRoom> {
    return super.deploy(_buyer, _seller, overrides || {}) as Promise<DealRoom>;
  }
  getDeployTransaction(
    _buyer: string,
    _seller: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(_buyer, _seller, overrides || {});
  }
  attach(address: string): DealRoom {
    return super.attach(address) as DealRoom;
  }
  connect(signer: Signer): DealRoomFactory {
    return super.connect(signer) as DealRoomFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DealRoom {
    return new Contract(address, _abi, signerOrProvider) as DealRoom;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [],
    name: "erc20",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "erc721",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "dealCount",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        name: "_buyer",
        type: "address"
      },
      {
        name: "_seller",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_id",
        type: "uint256"
      },
      {
        name: "_erc20",
        type: "address"
      },
      {
        name: "_erc721",
        type: "address"
      },
      {
        name: "_price",
        type: "uint256"
      },
      {
        name: "_assetItems",
        type: "uint256[]"
      }
    ],
    name: "makeDeal",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "id",
        type: "uint256"
      }
    ],
    name: "missingDealAssets",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "id",
        type: "uint256"
      }
    ],
    name: "missingDealTokens",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "id",
        type: "uint256"
      }
    ],
    name: "settle",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "dealId",
        type: "uint256"
      },
      {
        name: "count",
        type: "uint256"
      }
    ],
    name: "withdrawDealAssets",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "dealId",
        type: "uint256"
      }
    ],
    name: "withdrawDealTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "newOwner",
        type: "address"
      }
    ],
    name: "changeOwner",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "id",
        type: "uint256"
      }
    ],
    name: "getDeal",
    outputs: [
      {
        components: [
          {
            name: "id",
            type: "uint256"
          },
          {
            name: "erc20",
            type: "address"
          },
          {
            name: "erc721",
            type: "address"
          },
          {
            name: "price",
            type: "uint256"
          },
          {
            name: "assetItems",
            type: "uint256[]"
          },
          {
            name: "status",
            type: "uint8"
          },
          {
            name: "valid",
            type: "bool"
          }
        ],
        name: "",
        type: "tuple"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "id",
        type: "uint256"
      }
    ],
    name: "getDealStatus",
    outputs: [
      {
        name: "",
        type: "uint8"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051604080620016c7833981018060405262000033919081019062000099565b600680546001600160a01b0393841661010002610100600160a81b031990911617905560078054919092166001600160a01b03199182161790915560006003819055805490911633179055620000f7565b6000620000928251620000d8565b9392505050565b60008060408385031215620000ad57600080fd5b6000620000bb858562000084565b9250506020620000ce8582860162000084565b9150509250929050565b6000620000e582620000eb565b92915050565b6001600160a01b031690565b6115c080620001076000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80638df828001161008c578063bca6ce6411610066578063bca6ce64146101a8578063c698f53b146101b0578063e2812889146101d0578063eadb3c9c146101e3576100cf565b80638df828001461016f578063a6f9dae114610182578063a719e10314610195576100cf565b806301eb6ca4146100d457806345b623b2146100fd5780634d2d2c9d14610112578063785e9e861461012557806382fd5bac1461013a578063893d20e81461015a575b600080fd5b6100e76100e2366004611009565b6101eb565b6040516100f4919061149a565b60405180910390f35b61011061010b366004611009565b6102e2565b005b6100e7610120366004611009565b6104a2565b61012d6105e1565b6040516100f491906113fc565b61014d610148366004611009565b6105f0565b6040516100f49190611489565b6101626106d5565b6040516100f491906113a5565b61011061017d366004611009565b6106e5565b610110610190366004610fa7565b6107ba565b6101106101a33660046110d2565b610809565b61012d610aa4565b6101c36101be366004611009565b610ab3565b6040516100f4919061140a565b6101106101de366004611045565b610b75565b6100e7610d5d565b6000816101f6610e38565b6101ff826105f0565b905060018160a00151600381111561021357fe5b1461023c57604051600160e51b62461bcd02815260040161023390611429565b60405180910390fd5b610244610e38565b61024d856105f0565b6020810151604051600160e01b6370a082310281529192506001600160a01b0316906370a08231906102839030906004016113a5565b60206040518083038186803b15801561029b57600080fd5b505afa1580156102af573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506102d39190810190611027565b60609091015103949350505050565b8060016102ed610e38565b6102f6836105f0565b90508115158160c0015115151482610334576040518060400160405280600b8152602001600160a81b6a4445414c5f4558495354530281525061035f565b6040518060400160405280600e8152602001600160921b6d1111505317d393d517d193d55391028152505b90151561038257604051600160e51b62461bcd0281526004016102339190611418565b5061038b610e38565b610394856105f0565b905060038160a0015160038111156103a857fe5b14156103e0576007546001600160a01b031633146103db57604051600160e51b62461bcd02815260040161023390611449565b610412565b60065461010090046001600160a01b0316331461041257604051600160e51b62461bcd02815260040161023390611439565b80602001516001600160a01b031663a9059cbb3383606001516040518363ffffffff1660e01b81526004016104489291906113b9565b602060405180830381600087803b15801561046257600080fd5b505af1158015610476573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525061049a9190810190610feb565b505050505050565b6000816104ad610e38565b6104b6826105f0565b905060018160a0015160038111156104ca57fe5b146104ea57604051600160e51b62461bcd02815260040161023390611429565b60006104f4610e38565b6104fd866105f0565b905060005b8160800151518110156105d257306001600160a01b031682604001516001600160a01b0316636352211e84608001518481518110151561053e57fe5b906020019060200201516040518263ffffffff1660e01b8152600401610564919061149a565b60206040518083038186803b15801561057c57600080fd5b505afa158015610590573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506105b49190810190610fcd565b6001600160a01b031614156105ca576001909201915b600101610502565b50608001515103949350505050565b6002546001600160a01b031681565b6105f8610e38565b600082815260046020818152604092839020835160e0810185528154815260018201546001600160a01b03908116828501526002830154168186015260038201546060820152928101805485518185028101850190965280865293949193608086019383018282801561068a57602002820191906000526020600020905b815481526020019060010190808311610676575b5050509183525050600582015460209091019060ff1660038111156106ab57fe5b60038111156106b657fe5b815260059190910154610100900460ff16151560209091015292915050565b6000546001600160a01b03165b90565b806106ee610e38565b6106f7826105f0565b905060018160a00151600381111561070b57fe5b1461072b57604051600160e51b62461bcd02815260040161023390611429565b6000546001600160a01b0316331461075857604051600160e51b62461bcd02815260040161023390611469565b610761836104a2565b1561078157604051600160e51b62461bcd02815260040161023390611479565b61078a836101eb565b156107aa57604051600160e51b62461bcd02815260040161023390611459565b6107b5836003610d63565b505050565b6000546001600160a01b031633146107e757604051600160e51b62461bcd02815260040161023390611469565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b816001610814610e38565b61081d836105f0565b90508115158160c001511515148261085b576040518060400160405280600b8152602001600160a81b6a4445414c5f45584953545302815250610886565b6040518060400160405280600e8152602001600160921b6d1111505317d393d517d193d55391028152505b9015156108a957604051600160e51b62461bcd0281526004016102339190611418565b506108b2610e38565b6108bb866105f0565b9050600060038260a0015160038111156108d157fe5b141561090e5760065461010090046001600160a01b0316331461090957604051600160e51b62461bcd02815260040161023390611449565b61093b565b6007546001600160a01b0316331461093b57604051600160e51b62461bcd02815260040161023390611439565b60005b826080015151811015610a9a578682108015610a055750306001600160a01b031683604001516001600160a01b0316636352211e85608001518481518110151561098457fe5b906020019060200201516040518263ffffffff1660e01b81526004016109aa919061149a565b60206040518083038186803b1580156109c257600080fd5b505afa1580156109d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506109fa9190810190610fcd565b6001600160a01b0316145b15610a925782604001516001600160a01b03166323b872dd3033866080015185815181101515610a3157fe5b906020019060200201516040518463ffffffff1660e01b8152600401610a59939291906113d4565b600060405180830381600087803b158015610a7357600080fd5b505af1158015610a87573d6000803e3d6000fd5b505060019093019250505b60010161093e565b5050505050505050565b6001546001600160a01b031681565b6000816001610ac0610e38565b610ac9836105f0565b90508115158160c0015115151482610b07576040518060400160405280600b8152602001600160a81b6a4445414c5f45584953545302815250610b32565b6040518060400160405280600e8152602001600160921b6d1111505317d393d517d193d55391028152505b901515610b5557604051600160e51b62461bcd0281526004016102339190611418565b50610b5e610e38565b610b67866105f0565b60a001519695505050505050565b846000610b80610e38565b610b89836105f0565b90508115158160c0015115151482610bc7576040518060400160405280600b8152602001600160a81b6a4445414c5f45584953545302815250610bf2565b6040518060400160405280600e8152602001600160921b6d1111505317d393d517d193d55391028152505b901515610c1557604051600160e51b62461bcd0281526004016102339190611418565b506040518060e00160405280898152602001886001600160a01b03168152602001876001600160a01b0316815260200186815260200185815260200160016003811115610c5e57fe5b81526001602091820181905260008b81526004808452604091829020855181558585015193810180546001600160a01b039586166001600160a01b031991821617909155928601516002820180549190951693169290921790925560608401516003820155608084015180519193610cdb93850192910190610e74565b5060a082015160058201805460ff19166001836003811115610cf957fe5b021790555060c09190910151600591820180549115156101000261ff001990921691909117905580546001810182556000919091527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0019790975550505050505050565b60035481565b816001610d6e610e38565b610d77836105f0565b90508115158160c0015115151482610db5576040518060400160405280600b8152602001600160a81b6a4445414c5f45584953545302815250610de0565b6040518060400160405280600e8152602001600160921b6d1111505317d393d517d193d55391028152505b901515610e0357604051600160e51b62461bcd0281526004016102339190611418565b506000858152600460205260409020600501805485919060ff19166001836003811115610e2c57fe5b02179055505050505050565b6040805160e081018252600080825260208201819052918101829052606080820183905260808201529060a08201908152600060209091015290565b828054828255906000526020600020908101928215610eaf579160200282015b82811115610eaf578251825591602001919060010190610e94565b50610ebb929150610ebf565b5090565b6106e291905b80821115610ebb5760008155600101610ec5565b6000610ee58235611503565b9392505050565b6000610ee58251611503565b6000601f82018313610f0957600080fd5b8135610f1c610f17826114cf565b6114a8565b91508181835260208401935060208101905083856020840282011115610f4157600080fd5b60005b83811015610f6d5781610f578882610f8f565b8452506020928301929190910190600101610f44565b5050505092915050565b6000610ee5825161150e565b6000610ee5823561152b565b6000610ee582356106e2565b6000610ee582516106e2565b600060208284031215610fb957600080fd5b6000610fc58484610ed9565b949350505050565b600060208284031215610fdf57600080fd5b6000610fc58484610eec565b600060208284031215610ffd57600080fd5b6000610fc58484610f77565b60006020828403121561101b57600080fd5b6000610fc58484610f8f565b60006020828403121561103957600080fd5b6000610fc58484610f9b565b600080600080600060a0868803121561105d57600080fd5b60006110698888610f8f565b955050602061107a88828901610f83565b945050604061108b88828901610f83565b935050606061109c88828901610f8f565b925050608086013567ffffffffffffffff8111156110b957600080fd5b6110c588828901610ef8565b9150509295509295909350565b600080604083850312156110e557600080fd5b60006110f18585610f8f565b925050602061110285828601610f8f565b9150509250929050565b6000611118838361139c565b505060200190565b61112981611536565b82525050565b61112981611503565b6000611143826114f6565b61114d81856114fa565b9350611158836114f0565b60005b828110156111835761116e86835161110c565b9550611179826114f0565b915060010161115b565b5093949350505050565b6111298161150e565b6111298161152b565b61112981611541565b60006111b3826114f6565b6111bd81856114fa565b93506111cd81856020860161154c565b6111d68161157c565b9093019392505050565b60006111ed600d836114fa565b7f4445414c5f4e4f545f4f50454e00000000000000000000000000000000000000815260200192915050565b6000611226600b836114fa565b600160a81b6a53454c4c45525f4f4e4c5902815260200192915050565b6000611250600a836114fa565b600160b01b6942555945525f4f4e4c5902815260200192915050565b60006112796013836114fa565b7f4445414c5f544f4b454e535f4d495353494e4700000000000000000000000000815260200192915050565b60006112b2600a836114fa565b600160b11b6927a7262cafa7aba722a902815260200192915050565b60006112db6013836114fa565b7f4445414c5f4153534554535f4d495353494e4700000000000000000000000000815260200192915050565b805160009060e084019061131b858261139c565b50602083015161132e6020860182611196565b5060408301516113416040860182611196565b506060830151611354606086018261139c565b506080830151848203608086015261136c8282611138565b91505060a083015161138160a086018261119f565b5060c083015161139460c086018261118d565b509392505050565b611129816106e2565b602081016113b3828461112f565b92915050565b604081016113c78285611120565b610ee5602083018461139c565b606081016113e2828661112f565b6113ef6020830185611120565b610fc5604083018461139c565b602081016113b38284611196565b602081016113b3828461119f565b60208082528101610ee581846111a8565b602080825281016113b3816111e0565b602080825281016113b381611219565b602080825281016113b381611243565b602080825281016113b38161126c565b602080825281016113b3816112a5565b602080825281016113b3816112ce565b60208082528101610ee58184611307565b602081016113b3828461139c565b60405181810167ffffffffffffffff811182821017156114c757600080fd5b604052919050565b600067ffffffffffffffff8211156114e657600080fd5b5060209081020190565b60200190565b5190565b90815260200190565b60006113b38261151f565b151590565b600060048210610ebb57fe5b6001600160a01b031690565b60006113b382611503565b60006113b38261152b565b60006113b382611513565b60005b8381101561156757818101518382015260200161154f565b83811115611576576000848401525b50505050565b601f01601f19169056fea265627a7a72305820f62cc3baf8658ec3d01eea7a24624906fd5bfa1ada816d5d20e2754e0c137a4a6c6578706572696d656e74616cf50037";
