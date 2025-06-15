import mongoose, { Date, Schema, model } from "mongoose";


//TS interface
export interface IIncident {
    title: string,
    description: string,
    photoPath: string,
    reportedBy: mongoose.Schema.Types.ObjectId,
    workplaceId: mongoose.Schema.Types.ObjectId,
    status: string,
    //NOTE: THIS IS THE MONGOOSE DATE TYPE
    createdAt: Date,
    riskLevel: string
};


const IncidentSchema = new Schema<IIncident>({

    title: { type: String, required: true },

    description: { type: String, required: true },

    photoPath: { type: String },

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    workplaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workplace',
        required: true
    },
    
    //make strict required (?)
    status: {
        type: String,
        set: statusDefault,
    },

    //make strict required (?) 
    createdAt: {
        type: Date,
        set: createdAtDefault
        //set: createdAtDefault
    },

    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    }

})



function createdAtDefault(input:string){
    if(input === ""){
        return new Date()
    }else{
        //Add date validation here
        return Date.parse(input)
    }
}


function statusDefault(input:string){
    if(input === ""){
        return "Open"
    }else{
        return input
    }
}


//ES TS export default
export const Incident = model<IIncident>('Incident', IncidentSchema)
