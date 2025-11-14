//rolecheck with empty args results produces an unprotected route and can replace authToken(?)
import { Request, Response, NextFunction, RequestHandler } from "express"
import * as jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET_KEY || "OOPSY-DAISY";

//Cache variable for instances of roleCheck middleware
const roleCheckCache : Record<string, (req:Request, res:Response, next:NextFunction)=>void> = {}


//Role-checking factory function

export function roleCheck(...allowedRoles: String[] ){
    
    const cacheKey = allowedRoles.sort().join('|');
    return(roleCheckCache[cacheKey] || (roleCheckCache[cacheKey] = (req:Request, res:Response, next:NextFunction)=>{
        //Rolechecking logic goes here
        try {
            console.log("rolecheck hit")
                const authHeader = req.headers.authorization

                if (authHeader) {

                    
                    //console.log(decoded.role) 
                    
                    try{
                        const decoded = jwt.verify(authHeader, secretKey) as jwt.JwtPayload;
                        if(allowedRoles.length === 0){next()};
                            if(decoded  && decoded.role && !allowedRoles.includes(decoded.role)){
                                return res.status(403).json({ message: 'User unauthorised' })
                            }
                            console.log(decoded);
                            next();
                        
                    }catch(err){
                        return res.status(401).json({message: 'Invalid or expired token'})
                    }

                    // jwt.verify(authHeader, secretKey, (err, decoded) => {
                    //     if (err) {
                    //         return res.status(403).json({ message: 'Invalid token' })
                    //     } else {
                    //         //TEMP
                    //         //This is where we can do operations on decoded, using the asynchronous syntax
                    //         //route will be unprotected if no default value is passed, this will be represented by an empty rest parameter (allowedRoles = 0)

                    //     }

                    // })
                }
            } catch (err: any) {
                res.json({ message: err.message })
            }


    }))
        
    
}