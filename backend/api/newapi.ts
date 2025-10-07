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
                'Authorization': await this.loadToken(),
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


    async loadToken():Promise<string>{
        const token = localStorage.getItem('auth_token');
        if(!token){
            return "";
        }else{
            return token;
        }
    }


    



    /**
     * Login method attempts to validate credentials and return a JWT
     * Sets the JWT of the client - should return instead?
     * @async
     * @param {string} email - email of user logging in
     * @param {string} password - password of user logging in
     */
    async login(email:string, password:string):Promise<string>{
        console.log("function hit, response output due")


        return this.post<string>(`/login/`, JSON.stringify({email:email,password:password}))
        
        //deeper client-side response handling can be captured here?  Passed to response context perhaps?  Should this be part of the front end?
        //could make this return a strongly typed response object? Since the method is called directly off the client, we could make the client define the data of a login response, being a token and a user object.  
        //How could we persist the user in document form? We can only return one value - return a list, containing the user, and the JWT?
        //Alternatively, if resulting in validation, perform an immediate user get call?  

        
        //console.log(this.token);
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
