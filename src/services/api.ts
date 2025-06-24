//Change to new branch Types_Service_Extension
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
export { nuIncidentService, nuWorkplaceService, nuUserService, nuClient };







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