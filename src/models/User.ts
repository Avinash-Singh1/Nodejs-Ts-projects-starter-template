import mongoose, { Schema ,Document} from "mongoose";

// define interface
export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    createdAt:Date;
};

const UserSchema= new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>('User',UserSchema);

export default User;