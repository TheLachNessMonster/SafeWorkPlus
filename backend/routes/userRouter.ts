import { Request, Response, Router } from 'express';
const userRouter: Router = Router();
import { IUser, User } from '../models/user.js';
import mongoose from 'mongoose';

//GET (ALL)

userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users: mongoose.Document[] = await User.find().populate('workplaceId');
        res.json(users);
    } catch (err: any) {
        res.json({ message: err.message })
    }
})


// GET (ID)
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).populate('workplaceId');
        res.json(user);
    } catch (err: any) {
        res.json({ message: err.message })
    }
});


// CREATE
userRouter.post('/', async (req: Request, res: Response) => {

    //Instantiating a new person object to send to the database
    const user: mongoose.Document = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        workplaceId: req.body.workplaceId
    })

    try {
        const newUser: mongoose.Document = await user.save()
        res.json(newUser)
    } catch (err: any) {
        res.json({ message: err.message })
    }
})


// UPDATE

//NOTE: "can't set headers after response is sent to the client" error usually indicates you have competing responses
userRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            let workingCopy = user.toObject();
            for (let key of Object.keys(workingCopy) as (keyof IUser)[]) {
                if(req.body[key]!= null){
                    user[key] = req.body[key];
                }
            }

            //const patchedUser = await user.save();
            await user.save();
            const patchedUser = await User.findById(req.params.id).populate('workplaceId');
            res.json(patchedUser);
        }
    } catch (err: any) {
        res.json({ message: err.message })
    }

})

// DELETE
userRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    } catch (err: any) {
        res.json({ message: err.message })
    }


})

export default userRouter;