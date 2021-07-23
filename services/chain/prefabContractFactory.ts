import * as Erc20DetailedCompiled  from "../../ethereum/abi/IERC20.json"
import * as Erc721DetailedCompiled from "../../ethereum/abi/IERC721.json"
import * as DealHubCompiled from "../../ethereum/abi/DealHub.json"
import * as DealCompiled from "../../ethereum/abi/Deal.json"
import * as MultiSigHashedCompiled from "../../ethereum/abi/MultiSigHashed.json"

import { DealHub } from "../../ethereum/types/DealHub"
import { Deal } from "../../ethereum/types/Deal"
import { IERC20 } from "../../ethereum/types/IERC20"
import { IERC721 } from "../../ethereum/types/IERC721"
import { MultiSigHashed } from "../../ethereum/types/MultiSigHashed"

import { getContract } from "./contractFactory"
import { Signer } from "ethers"

export async function getDealContract(address: string, signer: Signer): Promise<Deal> {
    return getContract<Deal>(address, DealCompiled.abi, signer)
}

export async function getDealHubContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<DealHub> {
    return getContract<DealHub>(address, DealHubCompiled.abi, signerIdxOrAddressOrSigner) as Promise<DealHub>
}

export async function getErc20Contract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<IERC20> {
    return getContract(address, Erc20DetailedCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getErc721Contract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<IERC721> {
    return getContract(address, Erc721DetailedCompiled.abi, signerIdxOrAddressOrSigner)
}

export async function getMultiSigContract(address: string, signerIdxOrAddressOrSigner?: number | string | Signer): Promise<MultiSigHashed> {
    return getContract(address, MultiSigHashedCompiled.abi, signerIdxOrAddressOrSigner)
}