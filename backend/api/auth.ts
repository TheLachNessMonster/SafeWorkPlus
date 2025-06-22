//bcrypt config

import * as bcrypt from 'bcrypt';

//password generation
export async function hasher(input: string) {
    var output = await bcrypt.hash(input, 10, (err, hash) => {
        if (err) throw err;
        return hash;
    })
    return output;
}




//JWT setup
import { NextFunction, Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET_KEY || "OOPSY-DAISY";

//Auth middleware

export function authToken(req: Request, res: Response, next: NextFunction) {
    //cheeky type assertion, review
    console.log('now attempting auth')
    console.log(req.headers)
    try {
        const authHeader = req.headers.authorization || "some bs"
        console.log(authHeader);
        jwt.verify(authHeader, secretKey, (err, user) => {
            if(err) return res.status(403).json({message: 'Invalid token'})
            next()
        })
    } catch (err: any) {
        res.json({ message: err.message })
    }
}