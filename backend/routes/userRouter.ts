import { Request, Response, Router } from 'express';
const userRouter: Router = Router();
import { IUser, User } from '../models/user';
import mongoose from 'mongoose';
import { hasher } from '../api/auth';




/**
 * GET all, serialise as list
 */
userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users: mongoose.Document[] = await User.find().select('-password').populate('workplaceId');
        res.json(users);
    } catch (err: any) {
        res.json({ message: err.message })
    }
})




/**
 *GET by ID
 */
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('workplaceId');
        res.json(user);
    } catch (err: any) {
        res.json({ message: err.message })
    }
});




/**
 * POST a new document of router 'type' to DB
 */
userRouter.post('/', async (req: Request, res: Response) => {

    let hashedInput = await hasher(req.body.password).then(hash=>{return hash})

    //Instantiating a new person object to send to the database
    const user: mongoose.Document = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        workplaceId: req.body.workplaceId,
        password: hashedInput
    })

    try {
        const newUser: mongoose.Document = await user.save()
        res.json(newUser)
    } catch (err: any) {
        res.json({ message: err.message })
    }
})




/**
 * Updates document using PATCH.  
 * Type assertion used allows looping instead of direct mapping as service layer ensures PATCH req body takes shape of router type
 * Future refactoring will make this algorithm generic and modular
 */
userRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        //currently, password can't be reset if changed
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            let workingCopy = user.toObject();
            for (let key of Object.keys(workingCopy) as (keyof IUser)[]) {
                if(req.body[key]!= null){
                    user[key] = req.body[key];
                }
            }

            //const patchedUser = await user.save();
            //May have to use a different method here as user is no longer a direct analogue for the mongoose schema base, lacking password field
            await user.save();
            const patchedUser = await User.findById(req.params.id).populate('workplaceId');
            res.json(patchedUser);
        }
    } catch (err: any) {
        res.json({ message: err.message })
    }

})




/**
 * DELETE document from DB by ID/
 */
userRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    } catch (err: any) {
        res.json({ message: err.message })
    }


})




export default userRouter;