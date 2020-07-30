import { DealRoomDeployer } from "../../build/types/DealRoomDeployer";
import { DealRoom } from "../../build/types/DealRoom";
import { Erc20Detailed } from "../../build/types/Erc20Detailed";
import { Erc721Detailed } from "../../build/types/Erc721Detailed";
import { getContract } from "./contractFactory";

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