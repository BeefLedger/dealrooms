import { BigNumber, BigNumberish, utils } from "ethers";

export function bnEquals(first: BigNumberish, other: BigNumberish): boolean {
    return (BigNumber.from(first).toHexString() == BigNumber.from(other).toHexString())
}

export function bnToNumber(bn: BigNumberish): number {
    return BigNumber.from(bn).toNumber()
}