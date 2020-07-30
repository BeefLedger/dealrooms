/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import { Erc20Pausable } from "./Erc20Pausable";

export class Erc20PausableFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Erc20Pausable> {
    return super.deploy(overrides || {}) as Promise<Erc20Pausable>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Erc20Pausable {
    return super.attach(address) as Erc20Pausable;
  }
  connect(signer: Signer): Erc20PausableFactory {
    return super.connect(signer) as Erc20PausableFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Erc20Pausable {
    return new Contract(address, _abi, signerOrProvider) as Erc20Pausable;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
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
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "account",
        type: "address"
      }
    ],
    name: "isPauser",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "renouncePauser",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
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
        name: "account",
        type: "address"
      }
    ],
    name: "addPauser",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address"
      },
      {
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "account",
        type: "address"
      }
    ],
    name: "Paused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "account",
        type: "address"
      }
    ],
    name: "Unpaused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      }
    ],
    name: "PauserAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      }
    ],
    name: "PauserRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address"
      },
      {
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address"
      },
      {
        name: "to",
        type: "address"
      },
      {
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address"
      },
      {
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address"
      },
      {
        name: "addedValue",
        type: "uint256"
      }
    ],
    name: "increaseAllowance",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "spender",
        type: "address"
      },
      {
        name: "subtractedValue",
        type: "uint256"
      }
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

const _bytecode =
  "0x608060405261002061001561002f60201b60201c565b61003360201b60201c565b6004805460ff191690556101a6565b3390565b61004b81600361008260201b610d8f1790919060201c565b6040516001600160a01b038216907f6719d08c1888103bea251a4ed56406bd0c3e69723c8a1686e017e7bbe159b6f890600090a250565b610092828261012360201b60201c565b156100fe57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c6500604482015290519081900360640190fd5b6001600160a01b0316600090815260209190915260409020805460ff19166001179055565b60006001600160a01b0382161515610186576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806111616022913960400191505060405180910390fd5b506001600160a01b03166000908152602091909152604090205460ff1690565b610fac806101b56000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80636ef8d66d1161008c5780638456cb59116100665780638456cb5914610237578063a457c2d71461023f578063a9059cbb1461026b578063dd62ed3e14610297576100ea565b80636ef8d66d146101e357806370a08231146101eb57806382dc1ec414610211576100ea565b806339509351116100c8578063395093511461017f5780633f4ba83a146101ab57806346fbf68e146101b55780635c975abb146101db576100ea565b8063095ea7b3146100ef57806318160ddd1461012f57806323b872dd14610149575b600080fd5b61011b6004803603604081101561010557600080fd5b506001600160a01b0381351690602001356102c5565b604080519115158252519081900360200190f35b61013761032a565b60408051918252519081900360200190f35b61011b6004803603606081101561015f57600080fd5b506001600160a01b03813581169160208101359091169060400135610330565b61011b6004803603604081101561019557600080fd5b506001600160a01b038135169060200135610397565b6101b36103f5565b005b61011b600480360360208110156101cb57600080fd5b50356001600160a01b03166104f1565b61011b61050a565b6101b3610513565b6101376004803603602081101561020157600080fd5b50356001600160a01b0316610525565b6101b36004803603602081101561022757600080fd5b50356001600160a01b0316610540565b6101b3610597565b61011b6004803603604081101561025557600080fd5b506001600160a01b038135169060200135610669565b61011b6004803603604081101561028157600080fd5b506001600160a01b0381351690602001356106c7565b610137600480360360408110156102ad57600080fd5b506001600160a01b0381358116916020013516610725565b60045460009060ff16156103195760408051600160e51b62461bcd0281526020600482015260106024820152600160821b6f14185d5cd8589b194e881c185d5cd95902604482015290519081900360640190fd5b6103238383610750565b9392505050565b60025490565b60045460009060ff16156103845760408051600160e51b62461bcd0281526020600482015260106024820152600160821b6f14185d5cd8589b194e881c185d5cd95902604482015290519081900360640190fd5b61038f84848461076d565b949350505050565b60045460009060ff16156103eb5760408051600160e51b62461bcd0281526020600482015260106024820152600160821b6f14185d5cd8589b194e881c185d5cd95902604482015290519081900360640190fd5b61032383836107fa565b61040561040061084e565b6104f1565b151561044557604051600160e51b62461bcd028152600401808060200182810382526030815260200180610e5d6030913960400191505060405180910390fd5b60045460ff1615156104a15760408051600160e51b62461bcd02815260206004820152601460248201527f5061757361626c653a206e6f7420706175736564000000000000000000000000604482015290519081900360640190fd5b6004805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6104d461084e565b604080516001600160a01b039092168252519081900360200190a1565b600061050460038363ffffffff61085216565b92915050565b60045460ff1690565b61052361051e61084e565b6108be565b565b6001600160a01b031660009081526020819052604090205490565b61054b61040061084e565b151561058b57604051600160e51b62461bcd028152600401808060200182810382526030815260200180610e5d6030913960400191505060405180910390fd5b61059481610906565b50565b6105a261040061084e565b15156105e257604051600160e51b62461bcd028152600401808060200182810382526030815260200180610e5d6030913960400191505060405180910390fd5b60045460ff16156106335760408051600160e51b62461bcd0281526020600482015260106024820152600160821b6f14185d5cd8589b194e881c185d5cd95902604482015290519081900360640190fd5b6004805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586104d461084e565b60045460009060ff16156106bd5760408051600160e51b62461bcd0281526020600482015260106024820152600160821b6f14185d5cd8589b194e881c185d5cd95902604482015290519081900360640190fd5b610323838361094e565b60045460009060ff161561071b5760408051600160e51b62461bcd0281526020600482015260106024820152600160821b6f14185d5cd8589b194e881c185d5cd95902604482015290519081900360640190fd5b61032383836109bc565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b600061076461075d61084e565b84846109d0565b50600192915050565b600061077a848484610ac6565b6107f08461078661084e565b6107eb85604051806060016040528060278152602001610e14602791396001600160a01b038a166000908152600160205260408120906107c461084e565b6001600160a01b03168152602081019190915260400160002054919063ffffffff610c2c16565b6109d0565b5060019392505050565b600061076461080761084e565b846107eb856001600061081861084e565b6001600160a01b03908116825260208083019390935260409182016000908120918c16815292529020549063ffffffff610cc616565b3390565b60006001600160a01b038216151561089e57604051600160e51b62461bcd028152600401808060200182810382526022815260200180610ef26022913960400191505060405180910390fd5b506001600160a01b03166000908152602091909152604090205460ff1690565b6108cf60038263ffffffff610d2316565b6040516001600160a01b038216907fcd265ebaf09df2871cc7bd4133404a235ba12eff2041bb89d9c714a2621c7c7e90600090a250565b61091760038263ffffffff610d8f16565b6040516001600160a01b038216907f6719d08c1888103bea251a4ed56406bd0c3e69723c8a1686e017e7bbe159b6f890600090a250565b600061076461095b61084e565b846107eb85604051806060016040528060248152602001610f38602491396001600061098561084e565b6001600160a01b03908116825260208083019390935260409182016000908120918d1681529252902054919063ffffffff610c2c16565b60006107646109c961084e565b8484610ac6565b6001600160a01b0383161515610a1a57604051600160e51b62461bcd028152600401808060200182810382526023815260200180610e8d6023913960400191505060405180910390fd5b6001600160a01b0382161515610a6457604051600160e51b62461bcd028152600401808060200182810382526021815260200180610eb06021913960400191505060405180910390fd5b6001600160a01b03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383161515610b1057604051600160e51b62461bcd028152600401808060200182810382526024815260200180610f146024913960400191505060405180910390fd5b6001600160a01b0382161515610b5a57604051600160e51b62461bcd028152600401808060200182810382526022815260200180610e3b6022913960400191505060405180910390fd5b610b9d81604051806060016040528060258152602001610f5c602591396001600160a01b038616600090815260208190526040902054919063ffffffff610c2c16565b6001600160a01b038085166000908152602081905260408082209390935590841681522054610bd2908263ffffffff610cc616565b6001600160a01b038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115610cbe57604051600160e51b62461bcd0281526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610c83578181015183820152602001610c6b565b50505050905090810190601f168015610cb05780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b6000828201838110156103235760408051600160e51b62461bcd02815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b610d2d8282610852565b1515610d6d57604051600160e51b62461bcd028152600401808060200182810382526021815260200180610ed16021913960400191505060405180910390fd5b6001600160a01b0316600090815260209190915260409020805460ff19169055565b610d998282610852565b15610dee5760408051600160e51b62461bcd02815260206004820152601f60248201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c6500604482015290519081900360640190fd5b6001600160a01b0316600090815260209190915260409020805460ff1916600117905556fe4552433230207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e63654552433230207472616e7366657220746f20746865207a65726f2061646472657373506175736572526f6c653a2063616c6c657220646f6573206e6f742068617665207468652050617573657220726f6c65455243323020617070726f76652066726f6d20746865207a65726f2061646472657373455243323020617070726f766520746f20746865207a65726f2061646472657373526f6c65733a206163636f756e7420646f6573206e6f74206861766520726f6c65526f6c65733a206163636f756e7420697320746865207a65726f20616464726573734552433230207472616e736665722066726f6d20746865207a65726f206164647265737345524332302064656372656173656420616c6c6f77616e63652062656c6f77207a65726f4552433230207472616e7366657220616d6f756e7420657863656564732062616c616e6365a165627a7a723058200ea299a1a37ba45c5371d60b45ce5d18f9627d8adb5dfdd411dcc3fa07c83e6d0029526f6c65733a206163636f756e7420697320746865207a65726f2061646472657373";
