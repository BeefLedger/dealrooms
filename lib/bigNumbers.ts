import { utils } from "ethers";
import { BigNumberish } from "ethers/utils";

export function bnEquals(first: BigNumberish, other: BigNumberish): boolean {
    return (utils.bigNumberify(first).toHexString() == utils.bigNumberify(other).toHexString())
}

export function bnToNumber(bn: BigNumberish): number {
    return utils.bigNumberify(bn).toNumber()
}