import { Contract, ContractFactory } from "ethers";
import { Signer } from "ethers";
import { getProvider } from "./providerFactory";
import { getSigner } from "./signerFactory";

export async function deployContract <T extends Contract>(
    signer: Signer,
    compilerOutput: any,
    ...args: any[]
): Promise<T> {
    try {
        const contractFactory = ContractFactory.fromSolidity(compilerOutput.default, signer);
        const contract: T = (await contractFactory.deploy(...args)) as T;
        return (await contract.deployed()) as T;
    }
    catch (e) {
        throw `deployContract(): ${e}`
    }

};

export async function getContract <T extends Contract>(
    address: string,
    abi: any,
    addressOrIndexOrSigner?: string | number | Signer
): Promise<T> {
    let signer: Signer
    if (addressOrIndexOrSigner !== undefined) {
        if (!["string", "number"].includes(typeof(addressOrIndexOrSigner))) {
            signer = addressOrIndexOrSigner as unknown as Signer
        } else if (signer instanceof Signer) {
            signer = await getSigner(addressOrIndexOrSigner as string | number) as Signer
        }
        return new Contract(address, abi, signer) as T
    } else {
        const provider = getProvider()
        return new Contract(address, abi, provider) as T
    }
}

