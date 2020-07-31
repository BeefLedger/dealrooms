import { Contract, ContractFactory, Signer } from "ethers";
import { string } from "yargs";
import { getProvider } from "./providerFactory";
import { getSigner } from "./signerFactory";

export async function deployContract <T extends Contract>(
    signer: Signer,
    compilerOutput: any,
    ...args: any[]
): Promise<T> {
    const contractFactory = ContractFactory.fromSolidity(compilerOutput, signer);
    const contract: T = (await contractFactory.deploy(...args)) as T;
    return (await contract.deployed()) as T;
};

export async function getContract <T extends Contract>(
    address: string,
    abi: any,
    addressOrIndexOrSigner?: string | number | Signer
): Promise<T> {
    let signer: Signer
    if (addressOrIndexOrSigner !== undefined) {
        if (addressOrIndexOrSigner instanceof Signer) {
            signer = addressOrIndexOrSigner as Signer
        } else {
            signer = await getSigner(addressOrIndexOrSigner as string | number);
        }
        return new Contract(address, abi, signer) as T;
    } else {
        const provider = getProvider();
        return new Contract(address, abi, provider) as T;
    }
}

