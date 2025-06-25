import { Request, Response, Router } from 'express';
import { authToken} from '../api/auth'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
const loginRouter: Router = Router();
import { User } from '../models/user';
import dotenv from 'dotenv';
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY || "OOPSY-DAISY";



/**
 * @openapi
 * /login/{id}:
 *   post:
 *     summary: Authenticate a user by ID and password, then return a JWT token
 *     tags:
 *       - Login
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
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token on successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *       400:
 *         description: Invalid request format or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: password is required"
 *       Unauthorized:
 *         description: Authentication failed due to invalid or missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Failed to find user or password mismatch
 *                   example: Invalid credentials
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
 *                   example: Internal Server Error
 */
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
                res.status(401).json({ message: "Invalid credentials" })
            } else {
                if (secretKey) {
                    //if successful, issue token
                    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
                    res.json(token)
                }
            }
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
 * Test route for authToken middleware
 */
loginRouter.get('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('workplaceId');
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
})



    
export default loginRouter;




