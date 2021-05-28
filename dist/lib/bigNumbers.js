import { BigNumber } from "ethers";
export function bnEquals(first, other) {
    return (BigNumber.from(first).toHexString() == BigNumber.from(other).toHexString());
}
export function bnToNumber(bn) {
    return BigNumber.from(bn).toNumber();
}
