import { utils } from "ethers";
export function bnEquals(first, other) {
    return (utils.bigNumberify(first).toHexString() == utils.bigNumberify(other).toHexString());
}
export function bnToNumber(bn) {
    return utils.bigNumberify(bn).toNumber();
}
