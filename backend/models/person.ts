import {Schema, model} from "mongoose";


//TS interface
export interface IPerson{
    name: string,
    age: string,
    occupation: string
};


const personSchema = new Schema<IPerson>({
    name:{type:String, required:true},
    age:{type:String, required:true},
    occupation:{type:String, default:'No data'}
})

//ES TS export default
export const Person = model<IPerson>('Person', personSchema)