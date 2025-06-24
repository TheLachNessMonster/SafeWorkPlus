/**
 * @name NewApiClient
 * @classdesc Instantiated to handle DB connection, RESTful actions passing strongly typed data and holds JWT for auth
 */

class NewApiClient {




    /**@property {string} baseURL - sets base URL to make calls to */
    private baseURL: string;
    
    /**@property {string} token - holds the current JWT, default is NULL when unsigned */
    public token:string = 'NULL'


    /**
     * @constructor
     * @param {string} baseURL - URL for assignment 
     */
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }



    
    /**
     * Basic strongly typed request function.  Makes a request to the DB serialised as JSON, bearing current JWT.
     * @async
     * @param {string} endpoint - route endpoint to be concaternated with baseurl
     * @param {RequestInit} options - any additional configuration specifications for a request
     * @returns {Promise<T>}
     */
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {

        //concat target url
        const url = `${this.baseURL}${endpoint}`;

        //configure request w/ user-submitted params
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                //passes JWT
                'Authorization': this.token,
                ...options.headers,
            },
            ...options,
        };

        //send request, handle response/error
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
    



    /**
     * Login method attempts to validate credentials and return a JWT
     * @async
     * @param {string} id - id of user logging in
     * @param {string} password - password of user logging in
     */
    async login(id:string, password:string) {
        var response :string = await this.post<string>(`/login/${id}`, JSON.stringify({password:password}))
        this.token = response;
        console.log(this.token);
    }




    /**
     * GET method
     * @async
     * @param {string} endpoint - target router endpoint
     * @returns {Promise<T>} - promise bearing data structured to serialise to front end typed instance of document
     */ 
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }


    /**
     * POST method
     * @async
     * @param {string} endpoint - target router endpoint
     * @param entityRepresentation - representation of document of type T serialised to JSON for transmission
     * @returns {Promise<T>} - promise bearing data structured to serialise to front end typed instance of document
     */
    async post<T>(endpoint: string, entityRepresentation: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body: entityRepresentation });
    }


    /**
     * PATCH method
     * @async
     * @param {string} endpoint - target router endpoint
     * @param entityRepresentation - representation of document of type T serialised to JSON for transmission
     * @returns {Promise<T>} - promise bearing data structured to serialise to front end typed instance of document
     */
    async patch<T>(endpoint: string, entityRepresentation: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'PATCH', body: entityRepresentation });
    }


    /**
     * DELETE method
     * @async
     * @param {string} endpoint - target router endpoint
     * @returns {Promise<T>} - promise bearing data structured to serialise to front end typed instance of document
     */
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

}

export {NewApiClient}
