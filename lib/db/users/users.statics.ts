import { IUserDocument, IUserModel } from "./users.types";

export async function findByEmail(
    this: IUserModel,
    email: string,
): Promise<IUserDocument[]> {
    return this.find({ email });
}

export async function findByWalletAddress(
    this: IUserModel,
    walletAddress: string,
): Promise<IUserDocument[]> {
    return this.find({ walletAddress });
}