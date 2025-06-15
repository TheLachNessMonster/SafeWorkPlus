// src/services/api.ts

import type { Incident, Workplace, User } from '../types';
import {GenericService} from '../../backend/api/service'
import { NewApiClient } from '../../backend/api/newapi';

//hardcoded sorry 0_o
const nuClient = new NewApiClient('http://localhost:3000');

//config services for all 
const nuIncidentService = new GenericService<Incident>(nuClient, '/incidents');
const nuWorkplaceService = new GenericService<Workplace>(nuClient, '/workplaces');
const nuUserService= new GenericService<User>(nuClient, '/users');
export {nuIncidentService, nuWorkplaceService, nuUserService};







//This is actually super cool and elegant and works as a DTO
// request/response types
export interface CreateIncidentRequest {
  title: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  photoPath?: string;
  reportedBy: string; // user id
  workplaceId: string; // workplace id 
  status?: string; // defaults to 'Open'
}

// api config
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// // generic api client
// class ApiClient {
//   private baseURL: string;

//   constructor(baseURL: string) {
//     this.baseURL = baseURL;
//   }

//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     const url = `${this.baseURL}${endpoint}`;
    
//     const config: RequestInit = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       // check if backend returned an error msg
//       if (data.message && !Array.isArray(data) && !data._id) {
//         throw new Error(data.message);
//       }

//       return data;
//     } catch (error) {
//       console.error('API req failed:', error);
//       throw error;
//     }
//   }

//   // http methods
//   async get<T>(endpoint: string): Promise<T> {
//     return this.request<T>(endpoint, { method: 'GET' });
//   }

//   async post<T>(endpoint: string, data?: any): Promise<T> {
//     return this.request<T>(endpoint, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   async patch<T>(endpoint: string, data?: any): Promise<T> {
//     return this.request<T>(endpoint, {
//       method: 'PATCH',
//       body: JSON.stringify(data),
//     });
//   }

//   async delete<T>(endpoint: string): Promise<T> {
//     return this.request<T>(endpoint, { method: 'DELETE' });
//   }
// }



// create api client instance
// const apiClient = new ApiClient(API_BASE_URL);

// temporary hardcoded values
const TEMP_USER_ID = '684e5ced8fe1c860d4b53d1a'; // Ashley User
const TEMP_WORKPLACE_ID = '684e5bfc8fe1c860d4b53d0f'; // Construction Site A

// incident service - works w lachlan's routes
// export const incidentService = {
//   // get all incidents (no filtering yet)
//   // ie. this will return ALL incidents from ALL workplaces
//   async getIncidents(): Promise<Incident[]> {
//     const allIncidents = await apiClient.get<Incident[]>('/incidents');
    
//     return allIncidents;
    
//     // temp client-side filtering to only show incidents from our mock workplace
//     //return allIncidents.filter(incident => 
//     //  incident.workplaceId === TEMP_WORKPLACE_ID
//     //);
//   },

//   // get single incident by id -- WIP: no incident detail screen implemented
//   async getIncident(id: string): Promise<Incident> {
//     return apiClient.get<Incident>(`/incidents/${id}`);
//   },

   // create new incident
//   async createIncident(incidentData: Omit<CreateIncidentRequest, 'reportedBy' | 'workplaceId'>): Promise<Incident> {
//     // send the required fields with real IDs
//     const fullIncidentData = {
//       title: incidentData.title,
//       description: incidentData.description,
//       riskLevel: incidentData.riskLevel,
//       reportedBy: TEMP_USER_ID, // real Ashley User ID
//       workplaceId: TEMP_WORKPLACE_ID, // real Construction Site A ID
//       status: 'Open',
//       createdAt: new Date().toISOString()
//     };

//     console.log('Sending incident data:', fullIncidentData);

//     return apiClient.post<Incident>('/incidents', fullIncidentData);
//   },
// };

/*
this is a HACK for testing - auth would need to be implemented but is not in scope
*/

// utility func to set temp ids
// export const setTempIds = (userId: string, workplaceId: string) => {
//   console.warn('Using temporary IDs for API testing');
//   (window as any).TEMP_USER_ID = userId;              //global variables are generally bad practice!!!
//   (window as any).TEMP_WORKPLACE_ID = workplaceId;
// };

// // export temp ids for debugging
// export const getTempIds = () => ({
//   userId: TEMP_USER_ID,
//   workplaceId: TEMP_WORKPLACE_ID
// });