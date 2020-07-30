

import { Erc20Detailed } from "../../types/Erc20Detailed"
import { Erc721Detailed } from "../../types/Erc721Detailed"
import { getContract } from "./contractFactory"
import { DealRoomDeployer } from "../../types/DealRoomDeployer"
import { DealRoom } from "../../types/DealRoom"

export async function getDealRoomDeployerContract(address: string, signerIdxOrAddress?: number | string): Promise<DealRoomDeployer> {
    return getContract(address, DealRoomDeployer, signerIdxOrAddress)
}

export async function getDealRoomContract(address: string, signerIdxOrAddress?: number | string): Promise<DealRoom> {
    return getContract(address, DealRoom, signerIdxOrAddress)
}

export async function getErc20Contract(address: string, signerIdxOrAddress?: number | string): Promise<Erc20Detailed> {
    return getContract(address, Erc20Detailed, signerIdxOrAddress)
}

export async function getErc721Contract(address: string, signerIdxOrAddress?: number | string): Promise<Erc721Detailed> {
    return getContract(address, Erc721Detailed, signerIdxOrAddress)
}