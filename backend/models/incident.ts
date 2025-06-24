import mongoose, { Date, Schema, model } from "mongoose";




/**
 * Interface for Incident data storage, to be used as schema base
 * @interface IIncident
 * @prop title @type {string}
 * @prop description @type {string}
 * @prop photopath @type {string}
 * @prop reportedBy @type {mongoose.Schema.Types.ObjectId}
 * @prop workplaceId @type {mongoose.Schema.Types.ObjectId}
 * @prop status @type {string}
 * @prop createdAt @type {string}
 * @prop riskLevel @type {string}
 */
export interface IIncident {
    title: string,
    description: string,
    photoPath: string,
    reportedBy: mongoose.Schema.Types.ObjectId,
    workplaceId: mongoose.Schema.Types.ObjectId,
    status: string,
    createdAt: Date,
    riskLevel: string
};




/**
 * @name IncidentSchema
 * Schema implementing IIncident interface for Mongoose usage
 * @type {Schema<IIncident>}
 */
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
    
    status: {
        type: String,
        set: statusDefault,
    },

    createdAt: {
        type: Date,
        set: createdAtDefault
    },

    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    }

})




/**
 * @function createdAtDefault
 * used for managing createdAt POST requests in JSON format where default behaviour is represented by an empty string
 * @param {string} input - user input date and time or an empty string for default behaviour
 * @returns {Date} - user input date and time or current date and time for default behaviour
 */
function createdAtDefault(input:string){
    if(input === ""){
        return new Date()
    }else{
        //Add date validation here
        return Date.parse(input)
    }
}




/**
 * @function statusDefault
  * used for managing status POST requests in JSON format where default behaviour is represented by an empty string
 * @param {string} input - user input status or an empty string for default behaviour
 * @returns {string} - - user input status or "Open" for default behaviour
 */
function statusDefault(input:string){
    if(input === ""){
        return "Open"
    }else{
        return input
    }
}




export const Incident = model<IIncident>('Incident', IncidentSchema)