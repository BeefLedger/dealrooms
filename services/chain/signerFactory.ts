import { getProvider } from "./providerFactory";

export async function getSigner(addressOrIndex?: string | number) {
    return (await getProvider()).getSigner(addressOrIndex)
}