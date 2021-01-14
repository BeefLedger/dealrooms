var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';
export function getUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const magic = getMagicLink();
        const isLoggedIn = yield magic.user.isLoggedIn();
        if (isLoggedIn) {
            const user = yield magic.user.getMetadata();
            return user;
        }
        else {
            return null;
        }
    });
}
;
export function loginUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const magic = getMagicLink();
        yield magic.auth.loginWithMagicLink({ email });
    });
}
;
export function logoutUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const magic = getMagicLink();
        yield magic.user.logout();
    });
}
;
export function getMagicLink() {
    return new Magic(process.env.MAGIC_KEY || "pk_test_6ABE2E341F154BF7", {
        network: {
            rpcUrl: 'http://127.0.0.1:8545'
            //chainId: 1011 // Your own node's chainId 
        }
    });
}
export function getMagicProvider() {
    return new ethers.providers.Web3Provider(getMagicLink().rpcProvider);
}
