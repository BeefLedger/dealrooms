/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";

import { TransactionOverrides } from ".";
import { TestAsset } from "./TestAsset";

export class TestAssetFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: TransactionOverrides): Promise<TestAsset> {
    return super.deploy(overrides) as Promise<TestAsset>;
  }
  getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction {
    return super.getDeployTransaction(overrides);
  }
  attach(address: string): TestAsset {
    return super.attach(address) as TestAsset;
  }
  connect(signer: Signer): TestAssetFactory {
    return super.connect(signer) as TestAssetFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestAsset {
    return new Contract(address, _abi, signerOrProvider) as TestAsset;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Approval",
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
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "approve",
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
    name: "balanceOf",
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
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "getApproved",
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
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
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
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "ownerOf",
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
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
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
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256"
      }
    ],
    name: "tokenByIndex",
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
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256"
      }
    ],
    name: "tokenOfOwnerByIndex",
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
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
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
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604080518082018252600a81526915195cdd08105cdcd95d60b21b602080830191909152825180840190935260048352635441535360e01b9083015290620000616301ffc9a760e01b620000cb565b81516200007690600690602085019062000150565b5080516200008c90600790602084019062000150565b506200009f6380ac58cd60e01b620000cb565b620000b1635b5e139f60e01b620000cb565b620000c363780e9d6360e01b620000cb565b5050620001ec565b6001600160e01b031980821614156200012b576040805162461bcd60e51b815260206004820152601c60248201527f4552433136353a20696e76616c696420696e7465726661636520696400000000604482015290519081900360640190fd5b6001600160e01b0319166000908152602081905260409020805460ff19166001179055565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200019357805160ff1916838001178555620001c3565b82800160010185558215620001c3579182015b82811115620001c3578251825591602001919060010190620001a6565b50620001d1929150620001d5565b5090565b5b80821115620001d15760008155600101620001d6565b611b2a80620001fc6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80634f6ccce7116100a257806395d89b411161007157806395d89b4114610380578063a22cb46514610388578063b88d4fde146103b6578063c87b56dd1461047c578063e985e9c51461049957610116565b80634f6ccce7146103185780636352211e146103355780636c0360eb1461035257806370a082311461035a57610116565b806318160ddd116100e957806318160ddd1461023a57806323b872dd146102545780632f745c591461028a57806340c10f19146102b657806342842e0e146102e257610116565b806301ffc9a71461011b57806306fdde0314610156578063081812fc146101d3578063095ea7b31461020c575b600080fd5b6101426004803603602081101561013157600080fd5b50356001600160e01b0319166104c7565b604080519115158252519081900360200190f35b61015e6104ea565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610198578181015183820152602001610180565b50505050905090810190601f1680156101c55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101f0600480360360208110156101e957600080fd5b5035610580565b604080516001600160a01b039092168252519081900360200190f35b6102386004803603604081101561022257600080fd5b506001600160a01b0381351690602001356105e2565b005b6102426106bd565b60408051918252519081900360200190f35b6102386004803603606081101561026a57600080fd5b506001600160a01b038135811691602081013590911690604001356106ce565b610242600480360360408110156102a057600080fd5b506001600160a01b038135169060200135610725565b610238600480360360408110156102cc57600080fd5b506001600160a01b038135169060200135610750565b610238600480360360608110156102f857600080fd5b506001600160a01b0381358116916020810135909116906040013561075e565b6102426004803603602081101561032e57600080fd5b5035610779565b6101f06004803603602081101561034b57600080fd5b503561078f565b61015e6107b7565b6102426004803603602081101561037057600080fd5b50356001600160a01b0316610818565b61015e610880565b6102386004803603604081101561039e57600080fd5b506001600160a01b03813516906020013515156108e1565b610238600480360360808110156103cc57600080fd5b6001600160a01b0382358116926020810135909116916040820135919081019060808101606082013564010000000081111561040757600080fd5b82018360208201111561041957600080fd5b8035906020019184600183028401116401000000008311171561043b57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506109e6945050505050565b61015e6004803603602081101561049257600080fd5b5035610a44565b610142600480360360408110156104af57600080fd5b506001600160a01b0381358116916020013516610ceb565b6001600160e01b0319811660009081526020819052604090205460ff165b919050565b60068054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105765780601f1061054b57610100808354040283529160200191610576565b820191906000526020600020905b81548152906001019060200180831161055957829003601f168201915b5050505050905090565b600061058b82610d19565b6105c65760405162461bcd60e51b815260040180806020018281038252602c815260200180611a1f602c913960400191505060405180910390fd5b506000908152600460205260409020546001600160a01b031690565b60006105ed8261078f565b9050806001600160a01b0316836001600160a01b031614156106405760405162461bcd60e51b8152600401808060200182810382526021815260200180611aa36021913960400191505060405180910390fd5b806001600160a01b0316610652610d26565b6001600160a01b0316148061067357506106738161066e610d26565b610ceb565b6106ae5760405162461bcd60e51b81526004018080602001828103825260388152602001806119726038913960400191505060405180910390fd5b6106b88383610d2a565b505050565b60006106c96002610d98565b905090565b6106df6106d9610d26565b82610da3565b61071a5760405162461bcd60e51b8152600401808060200182810382526031815260200180611ac46031913960400191505060405180910390fd5b6106b8838383610e47565b6001600160a01b03821660009081526001602052604081206107479083610f93565b90505b92915050565b61075a8282610f9f565b5050565b6106b8838383604051806020016040528060008152506109e6565b6000806107876002846110cd565b509392505050565b600061074a826040518060600160405280602981526020016119d460299139600291906110e9565b60098054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105765780601f1061054b57610100808354040283529160200191610576565b60006001600160a01b03821661085f5760405162461bcd60e51b815260040180806020018281038252602a8152602001806119aa602a913960400191505060405180910390fd5b6001600160a01b038216600090815260016020526040902061074a90610d98565b60078054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105765780601f1061054b57610100808354040283529160200191610576565b6108e9610d26565b6001600160a01b0316826001600160a01b0316141561094f576040805162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015290519081900360640190fd5b806005600061095c610d26565b6001600160a01b03908116825260208083019390935260409182016000908120918716808252919093529120805460ff1916921515929092179091556109a0610d26565b6001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405180821515815260200191505060405180910390a35050565b6109f76109f1610d26565b83610da3565b610a325760405162461bcd60e51b8152600401808060200182810382526031815260200180611ac46031913960400191505060405180910390fd5b610a3e84848484611100565b50505050565b6060610a4f82610d19565b610a8a5760405162461bcd60e51b815260040180806020018281038252602f815260200180611a74602f913960400191505060405180910390fd5b60008281526008602090815260409182902080548351601f6002600019610100600186161502019093169290920491820184900484028101840190945280845260609392830182828015610b1f5780601f10610af457610100808354040283529160200191610b1f565b820191906000526020600020905b815481529060010190602001808311610b0257829003601f168201915b505060095493945050505060026000196101006001841615020190911604610b485790506104e5565b805115610c19576009816040516020018083805460018160011615610100020316600290048015610bb05780601f10610b8e576101008083540402835291820191610bb0565b820191906000526020600020905b815481529060010190602001808311610b9c575b5050825160208401908083835b60208310610bdc5780518252601f199092019160209182019101610bbd565b6001836020036101000a038019825116818451168082178552505050505050905001925050506040516020818303038152906040529150506104e5565b6009610c2484611152565b6040516020018083805460018160011615610100020316600290048015610c825780601f10610c60576101008083540402835291820191610c82565b820191906000526020600020905b815481529060010190602001808311610c6e575b5050825160208401908083835b60208310610cae5780518252601f199092019160209182019101610c8f565b6001836020036101000a03801982511681845116808217855250505050505090500192505050604051602081830303815290604052915050919050565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b600061074a60028361122d565b3390565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610d5f8261078f565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600061074a82611239565b6000610dae82610d19565b610de95760405162461bcd60e51b815260040180806020018281038252602c815260200180611946602c913960400191505060405180910390fd5b6000610df48361078f565b9050806001600160a01b0316846001600160a01b03161480610e2f5750836001600160a01b0316610e2484610580565b6001600160a01b0316145b80610e3f5750610e3f8185610ceb565b949350505050565b826001600160a01b0316610e5a8261078f565b6001600160a01b031614610e9f5760405162461bcd60e51b8152600401808060200182810382526029815260200180611a4b6029913960400191505060405180910390fd5b6001600160a01b038216610ee45760405162461bcd60e51b81526004018080602001828103825260248152602001806119226024913960400191505060405180910390fd5b610eef8383836106b8565b610efa600082610d2a565b6001600160a01b0383166000908152600160205260409020610f1c908261123d565b506001600160a01b0382166000908152600160205260409020610f3f9082611249565b50610f4c60028284611255565b5080826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b6000610747838361126b565b6001600160a01b038216610ffa576040805162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015290519081900360640190fd5b61100381610d19565b15611055576040805162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015290519081900360640190fd5b611061600083836106b8565b6001600160a01b03821660009081526001602052604090206110839082611249565b5061109060028284611255565b5060405181906001600160a01b038416906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60008080806110dc86866112cf565b9097909650945050505050565b60006110f684848461134a565b90505b9392505050565b61110b848484610e47565b61111784848484611414565b610a3e5760405162461bcd60e51b81526004018080602001828103825260328152602001806118f06032913960400191505060405180910390fd5b60608161117757506040805180820190915260018152600360fc1b60208201526104e5565b8160005b811561118f57600101600a8204915061117b565b60608167ffffffffffffffff811180156111a857600080fd5b506040519080825280601f01601f1916602001820160405280156111d3576020820181803683370190505b50859350905060001982015b831561122457600a840660300160f81b8282806001900393508151811061120257fe5b60200101906001600160f81b031916908160001a905350600a840493506111df565b50949350505050565b6000610747838361157c565b5490565b60006107478383611594565b6000610747838361165a565b60006110f684846001600160a01b0385166116a4565b815460009082106112ad5760405162461bcd60e51b81526004018080602001828103825260228152602001806118ce6022913960400191505060405180910390fd5b8260000182815481106112bc57fe5b9060005260206000200154905092915050565b8154600090819083106113135760405162461bcd60e51b81526004018080602001828103825260228152602001806119fd6022913960400191505060405180910390fd5b600084600001848154811061132457fe5b906000526020600020906002020190508060000154816001015492509250509250929050565b600082815260018401602052604081205482816113e55760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b838110156113aa578181015183820152602001611392565b50505050905090810190601f1680156113d75780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b508460000160018203815481106113f857fe5b9060005260206000209060020201600101549150509392505050565b6000611428846001600160a01b031661173b565b61143457506001610e3f565b6060611542630a85bd0160e11b611449610d26565b88878760405160240180856001600160a01b03168152602001846001600160a01b0316815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b838110156114b0578181015183820152602001611498565b50505050905090810190601f1680156114dd5780820380516001836020036101000a031916815260200191505b5095505050505050604051602081830303815290604052906001600160e01b0319166020820180516001600160e01b0383818316178352505050506040518060600160405280603281526020016118f0603291396001600160a01b0388169190611741565b9050600081806020019051602081101561155b57600080fd5b50516001600160e01b031916630a85bd0160e11b1492505050949350505050565b60009081526001919091016020526040902054151590565b6000818152600183016020526040812054801561165057835460001980830191908101906000908790839081106115c757fe5b90600052602060002001549050808760000184815481106115e457fe5b60009182526020808320909101929092558281526001898101909252604090209084019055865487908061161457fe5b6001900381819060005260206000200160009055905586600101600087815260200190815260200160002060009055600194505050505061074a565b600091505061074a565b6000611666838361157c565b61169c5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561074a565b50600061074a565b6000828152600184016020526040812054806117095750506040805180820182528381526020808201848152865460018181018955600089815284812095516002909302909501918255915190820155865486845281880190925292909120556110f9565b8285600001600183038154811061171c57fe5b90600052602060002090600202016001018190555060009150506110f9565b3b151590565b60606110f68484600085856117558561173b565b6117a6576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b60006060866001600160a01b031685876040518082805190602001908083835b602083106117e55780518252601f1990920191602091820191016117c6565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114611847576040519150601f19603f3d011682016040523d82523d6000602084013e61184c565b606091505b509150915061185c828286611867565b979650505050505050565b606083156118765750816110f9565b8251156118865782518084602001fd5b60405162461bcd60e51b81526020600482018181528451602484015284518593919283926044019190850190808383600083156113aa57818101518382015260200161139256fe456e756d657261626c655365743a20696e646578206f7574206f6620626f756e64734552433732313a207472616e7366657220746f206e6f6e20455243373231526563656976657220696d706c656d656e7465724552433732313a207472616e7366657220746f20746865207a65726f20616464726573734552433732313a206f70657261746f7220717565727920666f72206e6f6e6578697374656e7420746f6b656e4552433732313a20617070726f76652063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f76656420666f7220616c6c4552433732313a2062616c616e636520717565727920666f7220746865207a65726f20616464726573734552433732313a206f776e657220717565727920666f72206e6f6e6578697374656e7420746f6b656e456e756d657261626c654d61703a20696e646578206f7574206f6620626f756e64734552433732313a20617070726f76656420717565727920666f72206e6f6e6578697374656e7420746f6b656e4552433732313a207472616e73666572206f6620746f6b656e2074686174206973206e6f74206f776e4552433732314d657461646174613a2055524920717565727920666f72206e6f6e6578697374656e7420746f6b656e4552433732313a20617070726f76616c20746f2063757272656e74206f776e65724552433732313a207472616e736665722063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f766564a26469706673582212200c1eb22562e9a494de63eae1fd081bc5ee9690ee338bde791f3516c5ec6703ff64736f6c634300060c0033";
