import { NextFunction, Request, Response, Router } from 'express';
const loginRouter: Router = Router();
import { IUser, User } from '../models/user';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


//bcrypt config

import * as bcrypt from 'bcrypt';

//password generation
var password:string = "abc123"
bcrypt.hash(password, 10, (err, hash)=>{
    if(err) throw err;
    //database storage in callback
})

//validation on login
bcrypt.compare('entered_password', 'stored_hash', (err,result)=>{
    if (err) throw err;
    if(result){
        //authsuccess
    }else{
        //authfail
    }
})



//JWT config and token generation

import * as jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET_KEY||"OOPSY-DAISY";
const examplePayload = {userId:"ABC"}
if(secretKey){
    const token = jwt.sign(examplePayload, secretKey, {expiresIn: '1h'});
}


//Auth middleware

function authToken(req:Request, res:Response, next:NextFunction){
    //cheeky type assertion, review
    const authHeader = req.headers['authorisation'] as string;
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, secretKey, (err, user) =>{
        console.log('vallidation successful, route will proceed')
        next()
    })
}






//Handles a POST containing the login data:
loginRouter.post('/:id', async (req: Request, res: Response) => {
        try {
            //gets user from DB
            const user = await User.findById(req.params.id).populate('workplaceId');
            if(user){
                //compare with stored value
                const validated = await bcrypt.compare(req.body.password, user.password);
                //check if failed - respond with invalid credentials if so
                if(!validated){res.json({message:"Invalid credentials"})}
            }
            
            //res.json(user);
        } catch (err: any) {
            res.json({ message: err.message })
        }

})


//test secure route
loginRouter.get('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('workplaceId');
        res.json(user);
    } catch (err: any) {
        res.json({ message: err.message })
    }
})




export default loginRouter;




