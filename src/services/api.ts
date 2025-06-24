//Change to new branch Types_Service_Extension
// src/services/api.ts

import type { Incident, Workplace, User } from '../types';
import {GenericService} from '../../backend/api/service'
import { NewApiClient } from '../../backend/api/newapi';

//To be updated to environment variable
const nuClient = new NewApiClient('http://localhost:3000');

//config services for all routes
const nuIncidentService = new GenericService<Incident>(nuClient, '/incidents');
const nuWorkplaceService = new GenericService<Workplace>(nuClient, '/workplaces');
const nuUserService= new GenericService<User>(nuClient, '/users');
export {nuIncidentService, nuWorkplaceService, nuUserService};