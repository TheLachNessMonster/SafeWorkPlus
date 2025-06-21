import { GenericService } from "./service";
import { Incident, User, Workplace } from "../../src/types";


class IncidentService extends GenericService<Incident> {

    InitMap(dto: object): Incident {

        //Create new incident with sensible defaults
        let newIncident: Incident = {
            _id: '',
            title: '',
            description: '',
            riskLevel: 'Low',
            reportedBy: '684e5ced8fe1c860d4b53d1a', // real Ashley User ID
            workplaceId: '684e5bfc8fe1c860d4b53d0f', // real Construction Site A ID
            status: 'Open',
            createdAt: new Date().toISOString()
        };

        for (let key of Object.keys(dto)) {
            if (key in Object.keys(newIncident)) {
                newIncident[key as keyof Incident];
            }
        }
        return newIncident;
    }
}


class UserService extends GenericService<User> {
    // InitMap(dto: object): User {


    // }
}


class WorkplaceService extends GenericService<Workplace> {
    // InitMap(dto: object): Workplace {

    // }
}


//Looping is less performant than hardcoding if we know the shape of
//incoming data.  Can just do a type assertion?  Have the mapping methods as
//virtual forcing an override.

/*
InitMap():
params: dto:obj
returns: T
Init: takes input values, sets any null fields to defaults
If we know the shape of data
*/


/*
PatchMap():
params: dto:obj, target: T
returns: T
Patch: takes input values and alters appropriate fields
*/