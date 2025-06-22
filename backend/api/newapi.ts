import { response } from "express";

class NewApiClient {
    private baseURL: string;
    //HOLDS THE JWT
    private token:string = 'NULL'

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
                'Authorization': `Bearer ${this.token}`,
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            //Rip the token and store here, then return the message part of the response that contains the actual user info.

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    //LOGIN METHOD
    async login() {
        var response = await this.request('/login/684e5ced8fe1c860d4b53d1a', { method: 'POST' })
        console.log(response);

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
