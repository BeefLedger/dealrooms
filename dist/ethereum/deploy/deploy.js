var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as artifactDealRoomHub from "../abi/DealRoomHub.json";
import * as artifactTestCoin from "../abi/TestCoin.json";
import * as artifactTestAsset from "../abi/TestAsset.json";
import * as artifactMultisig from "../abi/MultiSigHashed.json";
import * as artifactTestContract from "../abi/TestContract.json";
import { deployContract } from "../../services/chain/contractFactory";
import { getDealRoomHubContract } from "../../services/chain/prefabContractFactory";
export const ERROR_NO_EVENT_FOUND = "NO_EVENT_FOUND";
export const ERROR_MULTIPLE_EVENTS = "ERROR_MULTIPLE_EVENTS";
export function deployTestCoin(signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = yield deployContract(signer, artifactTestCoin);
        return contract;
    });
}
export function deployTestAsset(signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = yield deployContract(signer, artifactTestAsset);
        return contract;
    });
}
export function deployTestContract(signer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contract = yield deployContract(signer, artifactTestContract);
            return contract;
        }
        catch (e) {
            throw `deployTestContract(): ${e}`;
        }
    });
}
export function deployMultisig(owners, approvalsRequired, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contract = yield deployContract(signer, artifactMultisig, owners, approvalsRequired);
            return contract;
        }
        catch (e) {
            throw `deployMultisig(): ${e}`;
        }
    });
}
export function deployDealRoomHub(signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = yield deployContract(signer, artifactDealRoomHub);
        return contract;
    });
}
export function deployDealRoom(params, owner, signer) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let roomAddress;
            const DealRoomHubContract = yield getDealRoomHubContract(params.dealRoomHubAddress, signer);
            const tx = yield DealRoomHubContract.functions.makeRoom(params);
            const receipt = yield tx.wait();
            //TODO: Make this a generic event finder
            const newRoomEvents = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.filter(evt => evt.event === 'NewRoomEvent');
            if (newRoomEvents) {
                if (newRoomEvents.length > 0) {
                    if (newRoomEvents.length === 1) {
                        roomAddress = ((_b = newRoomEvents[0]) === null || _b === void 0 ? void 0 : _b.args).addr;
                    }
                    else {
                        throw new Error(ERROR_MULTIPLE_EVENTS);
                    }
                }
            }
            else {
                throw new Error(ERROR_NO_EVENT_FOUND);
            }
            const dealRoomDetails = yield DealRoomHubContract.functions.getRoom(roomAddress);
            return dealRoomDetails;
        }
        catch (e) {
            console.error("deployDealRoom()", e);
        }
    });
}
export function deployBasicDealRoom(params, owner, signer) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let roomAddress;
            const DealRoomHubContract = yield getDealRoomHubContract(params.dealRoomHubAddress, signer);
            const tx = yield DealRoomHubContract.functions.makeBasicRoom(params.buyer, params.seller);
            const receipt = yield tx.wait();
            //TODO: Make this a generic event finder
            const newRoomEvents = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.filter(evt => evt.event === 'NewRoomEvent');
            if (newRoomEvents) {
                if (newRoomEvents.length > 0) {
                    if (newRoomEvents.length === 1) {
                        roomAddress = ((_b = newRoomEvents[0]) === null || _b === void 0 ? void 0 : _b.args).addr;
                    }
                    else {
                        throw new Error(ERROR_MULTIPLE_EVENTS);
                    }
                }
            }
            else {
                throw new Error(ERROR_NO_EVENT_FOUND);
            }
            const dealRoomDetails = yield DealRoomHubContract.functions.getRoom(roomAddress);
            return dealRoomDetails;
        }
        catch (e) {
            console.error("deployDealRoom()", e);
        }
    });
}
export function deployAll(signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {
            erc20: yield deployTestCoin(signer),
            erc721: yield deployTestAsset(signer),
            DealRoomHub: yield deployDealRoomHub(signer),
        };
        return result;
    });
}
