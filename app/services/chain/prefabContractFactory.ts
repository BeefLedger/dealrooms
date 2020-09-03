import * as Erc20DetailedCompiled  from "../../ethereum/abi/ERC20Detailed.json"
import * as Erc721DetailedCompiled from "../../ethereum/abi/ERC721Detailed.json"
import * as DealRoomCompiled from "../../ethereum/abi/DealRoom.json"
import * as MultiSigWalletCompiled from "../../ethereum/abi/MultiSigWallet.json"

import { DealRoom } from "../../ethereum/types/DealRoom"
import { Erc20Detailed } from "../../ethereum/types/Erc20Detailed"
import { Erc721Detailed } from "../../ethereum/types/Erc721Detailed"
import { MultiSigWallet } from "../../ethereum/types/MultiSigWallet"

import { getContract } from "./contractFactory"
import { Signer } from "ethers"

export async function getDealRoomContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<DealRoom> {
    //console.log(` getContract(${address}, DealRoomCompiled.abi, ${JSON.stringify(signerIdxOrAddressOrSigner)})`)
    return getContract(address, DealRoomCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getErc20Contract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<Erc20Detailed> {
    return getContract(address, Erc20DetailedCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getErc721Contract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<Erc721Detailed> {
    return getContract(address, Erc721DetailedCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getMultisigContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<MultiSigWallet> {
    return getContract(address, MultiSigWalletCompiled.abi, signerIdxOrAddressOrSigner)
}