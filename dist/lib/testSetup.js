var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { deployAll } from "../ethereum/deploy/deploy";
import { sendEth } from "../ethereum/utils";
import { getProvider } from "../services/chain/providerFactory";
const ERC20_DEMO_AMOUNT = 10000;
export const demoEnvironment = {
    erc721Allocations: {},
    erc20Allocations: {}
};
export function setupDemo(adminAddress, accounts) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = yield getProvider();
        // Create ERC-721 contract
        // Create ERC-20 contract
        // Create DealRoomHub
        demoEnvironment.deployedEnvironment = yield deployAll(provider.getSigner(adminAddress));
        let assetId = 0;
        for (const acct of accounts) {
            demoEnvironment.erc721Allocations[acct.address] = [];
            yield sendEth(acct.address, 0.1, provider.getSigner());
            demoEnvironment.deployedEnvironment.erc20.mint(acct.address, ERC20_DEMO_AMOUNT);
            demoEnvironment.erc20Allocations[acct.address] = ERC20_DEMO_AMOUNT;
            for (let i = 0; i < 5; i++) {
                assetId++;
                yield demoEnvironment.deployedEnvironment.erc721.mint(acct.address, assetId);
                demoEnvironment.erc721Allocations[acct.address].push(assetId);
            }
        }
        return demoEnvironment;
    });
}
