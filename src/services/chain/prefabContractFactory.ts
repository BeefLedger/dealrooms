import * as Erc20DetailedCompiled  from "../../abi/Erc20Detailed.json"
import * as Erc721DetailedCompiled from "../../abi/Erc721Detailed.json"
import * as DealRoomDeployerCompiled from "../../abi/DealRoomDeployer.json"
import * as DealRoomCompiled from "../../abi/DealRoom.json"

import { DealRoomDeployer } from "../../types/DealRoomDeployer"
import { DealRoom } from "../../types/DealRoom"
import { Erc20Detailed } from "../../types/Erc20Detailed"
import { Erc721Detailed } from "../../types/Erc721Detailed"

import { getContract } from "./contractFactory"

export async function getDealRoomDeployerContract(address: string, signerIdxOrAddress?: number | string): Promise<DealRoomDeployer> {
    return getContract(address, DealRoomDeployerCompiled.abi, signerIdxOrAddress)
}

export async function getDealRoomContract(address: string, signerIdxOrAddress?: number | string): Promise<DealRoom> {
    return getContract(address, DealRoomCompiled.abi, signerIdxOrAddress)
}

export async function getErc20Contract(address: string, signerIdxOrAddress?: number | string): Promise<Erc20Detailed> {
    return getContract(address, Erc20DetailedCompiled.abi, signerIdxOrAddress)
}

export async function getErc721Contract(address: string, signerIdxOrAddress?: number | string): Promise<Erc721Detailed> {
    return getContract(address, Erc721DetailedCompiled.abi, signerIdxOrAddress)
}