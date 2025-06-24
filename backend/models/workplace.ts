import {Schema, model} from "mongoose";




/**
 * Interface for workplace data storage, to be used as schema base
 * @interface IWorkplace
 * @prop name @type {string}
 * @prop location @type {string}
 */
export interface IWorkplace{
    name: string,
    location: string,
};




/**
 * @name userSchema
 * Schema implementing IUser interface for Mongoose usage
 * @type {Schema<IWorkplace>}
 */
const workplaceSchema = new Schema<IWorkplace>({
    name:{type:String, required:true},
    location:{type:String, required:true},
})




export const Workplace = model<IWorkplace>('Workplace', workplaceSchema)