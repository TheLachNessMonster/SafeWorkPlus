import { Request, Response, Router } from 'express';
const userRouter: Router = Router();
import { IUser, User } from '../models/user';
import mongoose from 'mongoose';
import { hasher } from '../api/auth';




/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       InternalServerError:
 *         description: Server encountered an unexpected condition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                      type: string
 *                      description: Error message describing the issue
 *                      example: Internal Server Error
 */

userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users: mongoose.Document[] = await User.find().select('-password').populate('workplaceId');
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
})




/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       InternalServerError:
 *         description: Server encountered an unexpected condition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                      type: string
 *                      description: Error message describing the issue
 *                      example: Internal Server Error
 */
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('workplaceId');
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
});




/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *               - workplaceId
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               workplaceId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: email is required"
 *       InternalServerError:
 *         description: Server encountered an unexpected condition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue
 *                   example: "Internal Server Error"
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
        res.status(201).json(newUser)
    } catch (err: any) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: err.message })
        } else {
            res.status(500).json({ message: err.message })
        }
    }
})




/**
 * Updates document using PATCH.  
 * Type assertion used allows looping instead of direct mapping as service layer ensures PATCH req body takes shape of router type
 * Future refactoring will make this algorithm generic and modular
 */
/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update user fields by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               workplaceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: email must be a valid email address"
 *       InternalServerError:
 *         description: Server encountered an unexpected condition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue
 *                   example: "Internal Server Error"
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
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: err.message })
        } else {
            res.status(500).json({ message: err.message })
        }
    }

})




/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deletion confirmation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       InternalServerError:
 *         description: Server encountered an unexpected condition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                      type: string
 *                      description: Error message describing the issue
 *                      example: Internal Server Error
 */
userRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }


})




export default userRouter;