import { Schema } from "mongoose";

const UserSchema = new Schema({
    name: String, 
    walletAddress: String,
    email: String,
    lastUpdated: Date,
});

export default UserSchema;