import * as bcrypt from 'bcrypt';


/**
 * @function hasher
 * Hashes a string using bcrypt
 * @async
 * @param {string} input -  string to be hashed
 * @returns hashed string
 */

export async function hasher(input: string) {
    var output = await bcrypt.hash(input, 10)
    return output;
}



import { NextFunction, Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { REPLCommand } from 'repl';

// TODO: crash server if key is undefined, otherwise a potential hardcoded key signature exists
// TODO: remove duplicate mentions of secret key
const secretKey = process.env.JWT_SECRET_KEY || "OOPSY-DAISY";


/**
 * @function authToken
 * Express middleware function that handles JWT authentication on protected routes
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export function authToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization
        if (authHeader) {
            jwt.verify(authHeader, secretKey, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid token' })
                } else {
                    //TEMP
                    console.log(decoded);
                    next();
                }

            })
        }
    } catch (err: any) {
        res.json({ message: err.message })
    }
}


// export function authUser(role:string):Function{
//     return authUser[role] || (authUser[role]=function (req: Request, res:Response, next:NextFunction){

//     })}

// }