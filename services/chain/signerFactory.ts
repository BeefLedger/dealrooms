import { getProvider } from "./providerFactory";

export async function getSigner(addressOrIndex?: string | number) {
    // console.log(`getSigner(${addressOrIndex})`)
    return (await getProvider()).getSigner(addressOrIndex)
}

