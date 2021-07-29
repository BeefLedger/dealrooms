var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as artifactDealHub from "../abi/DealHub.json";
import * as artifactTestCoin from "../abi/TestCoin.json";
import * as artifactTestAsset from "../abi/TestAsset.json";
import * as artifactMultisig from "../abi/MultiSigHashed.json";
import * as artifactTestContract from "../abi/TestContract.json";
import { deployContract } from "../../services/chain/contractFactory";
import { getDealHubContract } from "../../services/chain/prefabContractFactory";
export var ERROR_NO_EVENT_FOUND = "NO_EVENT_FOUND";
export var ERROR_MULTIPLE_EVENTS = "ERROR_MULTIPLE_EVENTS";
export function deployTestCoin(signer) {
    return __awaiter(this, void 0, void 0, function () {
        var contract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deployContract(signer, artifactTestCoin)];
                case 1:
                    contract = _a.sent();
                    return [2 /*return*/, contract];
            }
        });
    });
}
export function deployTestAsset(signer) {
    return __awaiter(this, void 0, void 0, function () {
        var contract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deployContract(signer, artifactTestAsset)];
                case 1:
                    contract = _a.sent();
                    return [2 /*return*/, contract];
            }
        });
    });
}
export function deployTestContract(signer) {
    return __awaiter(this, void 0, void 0, function () {
        var contract, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deployContract(signer, artifactTestContract)];
                case 1:
                    contract = _a.sent();
                    return [2 /*return*/, contract];
                case 2:
                    e_1 = _a.sent();
                    throw "deployTestContract(): " + e_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
export function deployMultisig(owners, approvalsRequired, signer) {
    return __awaiter(this, void 0, void 0, function () {
        var contract, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deployContract(signer, artifactMultisig, owners, approvalsRequired)];
                case 1:
                    contract = _a.sent();
                    return [2 /*return*/, contract];
                case 2:
                    e_2 = _a.sent();
                    throw "deployMultisig(): " + e_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
export function deployDealHub(signer) {
    return __awaiter(this, void 0, void 0, function () {
        var contract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deployContract(signer, artifactDealHub)];
                case 1:
                    contract = _a.sent();
                    return [2 /*return*/, contract];
            }
        });
    });
}
/*
export type DealRoomBasicCreateParams = {
    dealRoomHubAddress: string
    buyer: string
    seller: string
}
*/
export function deployDeal(params, owner, signer) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var dealAddress, dealHubContract, tx, receipt, dealCreatedEvents, e_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    dealAddress = void 0;
                    return [4 /*yield*/, getDealHubContract(params.dealHubAddress, signer)];
                case 1:
                    dealHubContract = _c.sent();
                    return [4 /*yield*/, dealHubContract.functions.makeDeal(params.buyer, params.seller, params.erc20, params.erc721, params.price, params.assetItems)];
                case 2:
                    tx = _c.sent();
                    return [4 /*yield*/, tx.wait()
                        //TODO: Make this a generic event finder
                    ];
                case 3:
                    receipt = _c.sent();
                    dealCreatedEvents = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.filter(function (evt) { return evt.event === 'DealCreated'; });
                    if (dealCreatedEvents) {
                        if (dealCreatedEvents.length > 0) {
                            if (dealCreatedEvents.length === 1) {
                                dealAddress = ((_b = dealCreatedEvents[0]) === null || _b === void 0 ? void 0 : _b.args).addr;
                            }
                            else {
                                throw new Error(ERROR_MULTIPLE_EVENTS);
                            }
                        }
                    }
                    else {
                        throw new Error(ERROR_NO_EVENT_FOUND);
                    }
                    return [2 /*return*/, dealAddress];
                case 4:
                    e_3 = _c.sent();
                    console.error("deployDeal()", e_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/*
export async function deployBasicDealRoom(params: DealRoomBasicCreateParams, owner: string, signer: Signer): Promise<DealRoomDetails>  {
    try {
        let roomAddress: string
        const DealRoomHubContract = await getDealRoomHubContract(params.dealRoomHubAddress, signer)
        const tx = await DealRoomHubContract.functions.makeBasicRoom(params.buyer, params.seller)
        const receipt = await tx.wait()

        //TODO: Make this a generic event finder
        const newRoomEvents = receipt.events?.filter(evt => evt.event === 'NewRoomEvent')
        if (newRoomEvents) {
            if (newRoomEvents.length > 0) {
                if (newRoomEvents.length === 1) {
                    roomAddress = (newRoomEvents[0]?.args as any).addr
                } else {
                    throw new Error(ERROR_MULTIPLE_EVENTS)
                }
            }
        } else {
            throw new Error(ERROR_NO_EVENT_FOUND)
        }

        const dealRoomDetails = await DealRoomHubContract.getRoom(roomAddress)//functions.getRoom(roomAddress)
        return dealRoomDetails;
    }
    catch (e) {
        console.error("deployDealRoom()", e)
    }
}

export async function deployRoomAndDeal(roomParams: DealRoomBasicCreateParams, deal: Deal, signer: Signer): Promise<{roomAddress: string, dealId: number}> {
    console.log(`deployRoomAndDeal ${1}`)
    let roomAddress: string
    const DealRoomHubContract = await getDealRoomHubContract(roomParams.dealRoomHubAddress, signer)
    console.log(`deployRoomAndDeal ${2}`)
    const tx = await DealRoomHubContract.functions.makeBasicRoomAndDeal(roomParams.buyer, roomParams.seller, deal.erc20, deal.erc721, BigNumber.from(deal.price), deal.assetItems)
    console.log(`deployRoomAndDeal ${3}`)
    const receipt = await tx.wait()
    console.log(`deployRoomAndDeal ${4}`)
    
    //TODO: Make this a generic event finder
    const newRoomEvents = receipt.events?.filter(evt => evt.event === 'NewRoomEvent')
    if (newRoomEvents) {
        console.log(`deployRoomAndDeal ${4.1}`)
        if (newRoomEvents.length > 0) {
            if (newRoomEvents.length === 1) {
                console.log(`deployRoomAndDeal ${4.2}`)
                roomAddress = (newRoomEvents[0]?.args as any).addr
            } else {
                console.log(`deployRoomAndDeal ${4.3}`)
                throw new Error(ERROR_MULTIPLE_EVENTS)
            }
        }
    } else {
        console.log(`deployRoomAndDeal ${4.4}`)
        throw new Error(ERROR_NO_EVENT_FOUND)
    }
    console.log(`deployRoomAndDeal ${5}`)
    return {
        roomAddress,
        dealId: 0
    }
}
*/
export function deployAll(signer) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, deployTestCoin(signer)];
                case 1:
                    _a.erc20 = _b.sent();
                    return [4 /*yield*/, deployTestAsset(signer)];
                case 2:
                    _a.erc721 = _b.sent();
                    return [4 /*yield*/, deployDealHub(signer)];
                case 3:
                    result = (_a.DealHub = _b.sent(),
                        _a);
                    return [2 /*return*/, result];
            }
        });
    });
}
