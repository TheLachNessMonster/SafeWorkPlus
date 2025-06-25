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
            jwt.verify(authHeader, secretKey, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid token' })
                } else {
                    next()
                }

            })
        }
    } catch (err: any) {
        res.json({ message: err.message })
    }
}