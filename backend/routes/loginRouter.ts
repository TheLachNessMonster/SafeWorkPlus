import { NextFunction, Request, Response, Router } from 'express';
const loginRouter: Router = Router();
import { IUser, User } from '../models/user';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


//bcrypt config

import * as bcrypt from 'bcrypt';

//password generation
async function hasher(input: string) {
    var output = await bcrypt.hash(input, 10, (err, hash) => {
        if (err) throw err;
        return hash;
    })
    return output;
}

//validation on login
bcrypt.compare('entered_password', 'stored_hash', (err, result) => {
    if (err) throw err;
    if (result) {
        //authsuccess
    } else {
        //authfail
    }
})



//JWT config and token generation

import * as jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET_KEY || "OOPSY-DAISY";



//Auth middleware

function authToken(req: Request, res: Response, next: NextFunction) {
    //cheeky type assertion, review
    try {
        const authHeader = req.headers['authorisation'] as string;
        console.log(authHeader);
        const token = authHeader && authHeader.split(' ')[1]

        jwt.verify(token, secretKey, (err, user) => {
            next()
        })

    } catch (err: any) {
        res.json({ message: err.message })
    }

}






//Handles a POST containing the login data:
loginRouter.post('/:id', async (req: Request, res: Response) => {
    try {
        //gets user from DB
        console.log('hit, looking for user')
        const user = await User.findById(req.params.id).populate('workplaceId');
        if (!user) {
            res.json({ message: 'Failed to find user' , output:user})
        } else {
            console.log('found user')
            //compare with stored value
            const validated = await bcrypt.compare(req.body.password, user.password);
            console.log('validation check completed')
            //check if failed - respond with invalid credentials if so
            if (!validated) {
                res.json({ message: "Invalid credentials" })
            } else {
                if (secretKey) {
                    //if successful, issue token
                    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
                    res.json({ message: token })
                }
            }



        }

        //WE GET TO HERE, WE DON'T ENTER THE IF



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


// loginRouter.get('/', async (req: Request, res: Response) => {
//     try {
//         console.log('hit')
//         const users: mongoose.Document[] = await User.find().select('-password').populate('workplaceId')
//         if (secretKey) {
//             const token = jwt.sign(users, secretKey, { expiresIn: '1h' });
//             res.json({token:token})
//         }
//     } catch (err: any) {
//         res.json({ message: err.message })
//     }
// })



export default loginRouter;




