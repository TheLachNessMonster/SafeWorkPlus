import mongoose, { Schema, model } from "mongoose";


//TS interface
export interface IUser {
    name: string,
    email: string,
    role: string,
    workplaceId: mongoose.Schema.Types.ObjectId
    password: string;
};


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    workplaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workplace',
        required: true
    },
    password:{ type: String, required: true }
})

export const User = model<IUser>('User', userSchema)