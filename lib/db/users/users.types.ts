import { Document, Model } from "mongoose";

export interface IUser {
    name: String, 
    walletAddress: String,
    email: String,
    lastUpdated: Date,
}
export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}