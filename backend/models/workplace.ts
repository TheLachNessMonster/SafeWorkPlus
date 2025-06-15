import {Schema, model} from "mongoose";


//TS interface
export interface IWorkplace{
    name: string,
    location: string,
};


const workplaceSchema = new Schema<IWorkplace>({
    name:{type:String, required:true},
    location:{type:String, required:true},
})

//ES TS export default
export const Workplace = model<IWorkplace>('Workplace', workplaceSchema)