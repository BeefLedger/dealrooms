import * as Erc20DetailedCompiled  from "../../abi/ERC20Detailed.json"
import * as Erc721DetailedCompiled from "../../abi/ERC721Detailed.json"
import * as DealRoomDeployerCompiled from "../../abi/DealRoomDeployer.json"
import * as DealRoomCompiled from "../../abi/DealRoom.json"

import { DealRoomDeployer } from "../../types/DealRoomDeployer"
import { DealRoom } from "../../types/DealRoom"
import { Erc20Detailed } from "../../types/Erc20Detailed"
import { Erc721Detailed } from "../../types/Erc721Detailed"

import { getContract } from "./contractFactory"
import { Signer } from "ethers"

export async function getDealRoomDeployerContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<DealRoomDeployer> {
    return getContract(address, DealRoomDeployerCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getDealRoomContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<DealRoom> {
    return getContract(address, DealRoomCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getErc20Contract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<Erc20Detailed> {
    return getContract(address, Erc20DetailedCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getErc721Contract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<Erc721Detailed> {
    return getContract(address, Erc721DetailedCompiled.abi, signerIdxOrAddressOrSigner)
}