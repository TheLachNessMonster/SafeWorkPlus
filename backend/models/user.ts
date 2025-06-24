import mongoose, { Schema, model } from "mongoose";




/**
 * Interface for User data storage, to be used as schema base
 * @interface IUser
 * @prop name @type {string}
 * @prop email @type {string}
 * @prop role @type {string}
 * @prop workplaceId @type {mongoose.Schema.Types.ObjectId}
 * @prop password @type {string}
 */
export interface IUser {
    name: string,
    email: string,
    role: string,
    workplaceId: mongoose.Schema.Types.ObjectId
    password: string;
};




/**
 * @name userSchema
 * Schema implementing IUser interface for Mongoose usage
 * @type {Schema<IUser>}
 */
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