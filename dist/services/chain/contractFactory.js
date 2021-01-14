var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Contract, ContractFactory, Signer } from "ethers";
import { getProvider } from "./providerFactory";
import { getSigner } from "./signerFactory";
export function deployContract(signer, compilerOutput, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contractFactory = ContractFactory.fromSolidity(compilerOutput.default, signer);
            const contract = (yield contractFactory.deploy(...args));
            return (yield contract.deployed());
        }
        catch (e) {
            throw `deployContract(): ${e}`;
        }
    });
}
;
export function getContract(address, abi, addressOrIndexOrSigner) {
    return __awaiter(this, void 0, void 0, function* () {
        let signer;
        if (addressOrIndexOrSigner !== undefined) {
            if (!["string", "number"].includes(typeof (addressOrIndexOrSigner))) {
                signer = addressOrIndexOrSigner;
            }
            else if (signer instanceof Signer) {
                signer = yield getSigner(addressOrIndexOrSigner);
            }
            return new Contract(address, abi, signer);
        }
        else {
            const provider = getProvider();
            return new Contract(address, abi, provider);
        }
    });
}
