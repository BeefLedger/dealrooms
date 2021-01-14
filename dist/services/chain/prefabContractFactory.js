var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Erc20DetailedCompiled from "../../ethereum/abi/IERC20.json";
import * as Erc721DetailedCompiled from "../../ethereum/abi/IERC721.json";
import * as DealRoomHubCompiled from "../../ethereum/abi/DealRoomHub.json";
import * as DealRoomCompiled from "../../ethereum/abi/DealRoom.json";
import * as MultiSigHashedCompiled from "../../ethereum/abi/MultiSigHashed.json";
import { getContract } from "./contractFactory";
export function getDealRoomHubContract(address, signerIdxOrAddressOrSigner) {
    return __awaiter(this, void 0, void 0, function* () {
        return getContract(address, DealRoomHubCompiled.abi, signerIdxOrAddressOrSigner);
    });
}
export function getDealRoomContract(address, signerIdxOrAddressOrSigner) {
    return __awaiter(this, void 0, void 0, function* () {
        return getContract(address, DealRoomCompiled.abi, signerIdxOrAddressOrSigner);
    });
}
export function getErc20Contract(address, signerIdxOrAddressOrSigner) {
    return __awaiter(this, void 0, void 0, function* () {
        return getContract(address, Erc20DetailedCompiled.abi, signerIdxOrAddressOrSigner);
    });
}
export function getErc721Contract(address, signerIdxOrAddressOrSigner) {
    return __awaiter(this, void 0, void 0, function* () {
        return getContract(address, Erc721DetailedCompiled.abi, signerIdxOrAddressOrSigner);
    });
}
export function getMultiSigContract(address, signerIdxOrAddressOrSigner) {
    return __awaiter(this, void 0, void 0, function* () {
        return getContract(address, MultiSigHashedCompiled.abi, signerIdxOrAddressOrSigner);
    });
}
