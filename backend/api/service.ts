import { NewApiClient } from "./newapi";



export class GenericService<T> {

    //fields
    client: NewApiClient;
    endpoint: string;


    //ctor
    constructor(client: NewApiClient, endpoint: string) {
        this.client = client;
        this.endpoint = endpoint;
    }
    

    //methods
    async getAll():Promise<T[]> {
        let dto = this.client.get<T[]>(this.endpoint);
        return dto;
    }

    async getById(id: string): Promise<T> {
        let dto = await this.client.get<T>(this.endpoint + "/" + id)
        return dto;
    }

    async create(entity: T): Promise<T> {
        let dto = await this.client.post<T>(this.endpoint, JSON.stringify(entity))
        return dto;
    }

    async update(id: string, entity: T): Promise<T> {
        let dto = await this.client.patch<T>(this.endpoint + '/' + id, JSON.stringify(entity))
        return dto;
    }

    async delete(id: string):Promise<T> {
        let dto = this.client.delete<T>(this.endpoint + '/' + id);
        return dto;
    }

}


