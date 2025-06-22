import { Request, Response, Router } from 'express';
import { authToken} from '../api/auth'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
const loginRouter: Router = Router();
import { IUser, User } from '../models/user';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY || "OOPSY-DAISY";






//Handles a POST containing the login data:
loginRouter.post('/:id', async (req: Request, res: Response) => {
    try {
        //gets user from DB
        const user = await User.findById(req.params.id).populate('workplaceId');
        if (!user) {
            res.json({ message: 'Failed to find user' , output:user})
        } else {
            //compare with stored value
            const validated = await bcrypt.compare(req.body.password, user.password);
            //check if failed - respond with invalid credentials if so
            if (!validated) {
                res.json({ message: "Invalid credentials" })
            } else {
                if (secretKey) {
                    //if successful, issue token
                    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
                    res.json(token)
                }
            }
        }

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




