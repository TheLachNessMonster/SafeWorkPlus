import { NewApiClient } from "./newapi";

/**
 * @name GenericService
 * @classdesc Instantiated to target a router and return strongly typed representations of the documents accessed through that router
 */

export class GenericService<T> {

    /**@property {NewApiClient} client - instance of a DB client*/
    client: NewApiClient;

    /**@property {string} endpoint - endpoint being targeted, corresponding to defined router endpoints*/
    endpoint: string;



    /**
     * @constructor
     * @param {NewApiClient} client - client instance
     * @param {string} endpoint - target endpoint
     */
    constructor(client: NewApiClient, endpoint: string) {
        this.client = client;
        this.endpoint = endpoint;
    }
    


    
    /**
     * GET all for returning all docs of type in list format
     * @returns {Promise<T[]>} - list of docs mapped to FE type
     */
    async getAll():Promise<T[]> {
        let dto = this.client.get<T[]>(this.endpoint);
        return dto;
    }


    /**
     * GETs target document
     * @param {string} id - target doc id
     * @returns {Promise<T>} - instance of doc mapped to FE type
     */
    async getById(id: string): Promise<T> {
        let dto = await this.client.get<T>(this.endpoint + "/" + id)
        return dto;
    }


    /**
     * CREATEs new document
     * @param {T} entity - takes an entity of FE type to serialise and send to DB
     * @returns {Promise<T>} - instance of doc mapped to FE type
     */
    async create(entity: T): Promise<T> {
        let dto = await this.client.post<T>(this.endpoint, JSON.stringify(entity))
        return dto;
    }


    /**
     * UPDATEs existing document
     * @param {string} id - target doc id
     * @param {T} entity - takes an entity of FE type to serialise and send to DB
     * @returns {Promise<T>} - instance of doc mapped to FE type
     */
    async update(id: string, entity: T): Promise<T> {
        let dto = await this.client.patch<T>(this.endpoint + '/' + id, JSON.stringify(entity))
        return dto;
    }


    /**
     * 
     * @param {string} id - target doc id
     * @returns {Promise<T>} - instance of doc mapped to FE type
     */
    async delete(id: string):Promise<T> {
        let dto = this.client.delete<T>(this.endpoint + '/' + id);
        return dto;
    }

}


