import * as Erc20DetailedCompiled  from "../../ethereum/abi/IERC20.json"
import * as Erc721DetailedCompiled from "../../ethereum/abi/IERC721.json"
import * as DealRoomHubCompiled from "../../ethereum/abi/DealRoomHub.json"
import * as DealRoomCompiled from "../../ethereum/abi/DealRoom.json"
import * as MultiSigHashedCompiled from "../../ethereum/abi/MultiSigHashed.json"

import { DealRoomHub } from "../../ethereum/types/DealRoomHub"
import { DealRoom } from "../../ethereum/types/DealRoom"
import { Ierc20 } from "../../ethereum/types/Ierc20"
import { Ierc721 } from "../../ethereum/types/Ierc721"
import { MultiSigHashed } from "../../ethereum/types/MultiSigHashed"

import { getContract } from "./contractFactory"
import { Signer } from "ethers"

export async function getDealRoomHubContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<DealRoomHub> {
    return getContract<DealRoomHub>(address, DealRoomHubCompiled.abi, signerIdxOrAddressOrSigner) as Promise<DealRoomHub>
}

export async function getDealRoomContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<DealRoom> {
    return getContract<DealRoom>(address, DealRoomCompiled.abi, signerIdxOrAddressOrSigner) as Promise<DealRoom>
}

export async function getErc20Contract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<Ierc20> {
    return getContract(address, Erc20DetailedCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getErc721Contract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<Ierc721> {
    return getContract(address, Erc721DetailedCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getMultiSigContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<MultiSigHashed> {
    return getContract(address, MultiSigHashedCompiled.abi, signerIdxOrAddressOrSigner)
}