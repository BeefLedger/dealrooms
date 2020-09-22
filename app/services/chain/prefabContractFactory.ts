import * as Erc20DetailedCompiled  from "../../ethereum/abi/ERC20Detailed.json"
import * as Erc721DetailedCompiled from "../../ethereum/abi/ERC721Detailed.json"
import * as DealRoomDeployerCompiled from "../../ethereum/abi/DealRoomDeployer.json"
import * as DealRoomCompiled from "../../ethereum/abi/DealRoom.json"
import * as MultiSigWalletCompiled from "../../ethereum/abi/MultiSigWallet.json"

import { DealRoomDeployer } from "ethereum/types/DealRoomDeployer"
import { DealRoom } from "../../ethereum/types/DealRoom"
import { Erc20Detailed } from "../../ethereum/types/Erc20Detailed"
import { Erc721Detailed } from "../../ethereum/types/Erc721Detailed"
import { MultiSigWallet } from "../../ethereum/types/MultiSigWallet"

import { getContract } from "./contractFactory"
import { Signer } from "ethers"


export async function getDealRoomDeployerContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<DealRoomDeployer> {
    //console.log(` getContract(${address}, DealRoomCompiled.abi, ${JSON.stringify(signerIdxOrAddressOrSigner)})`)
    return getContract<DealRoomDeployer>(address, DealRoomDeployerCompiled.abi, signerIdxOrAddressOrSigner) as Promise<DealRoomDeployer>
}

export async function getDealRoomContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<DealRoom> {
    //console.log(` getContract(${address}, DealRoomCompiled.abi, ${JSON.stringify(signerIdxOrAddressOrSigner)})`)
    return getContract<DealRoom>(address, DealRoomCompiled.abi, signerIdxOrAddressOrSigner) as Promise<DealRoom>
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