import { response } from "express";

class NewApiClient {
    private baseURL: string;
    //HOLDS THE JWT - MAKE PRIVATE
    public token:string = 'NULL'

    //loads the api url target
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    //api client request function
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {

        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                //passes JWT
                'Authorization': this.token,
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    //LOGIN METHOD
    async login(id:string, password:string) {
        var response :string = await this.post<string>(`/login/${id}`, JSON.stringify({password:password}))
        this.token = response;
        console.log(this.token);
    }

    //HTTP VERBS 
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, entityRepresentation: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body: entityRepresentation });
    }

    async patch<T>(endpoint: string, entityRepresentation: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'PATCH', body: entityRepresentation });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

}

export {NewApiClient}
