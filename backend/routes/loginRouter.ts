import { Request, Response, Router } from 'express';
import { authToken} from '../api/auth'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
const loginRouter: Router = Router();
import { User } from '../models/user';
import {hasher} from '../api/auth'
import dotenv from 'dotenv';
import { json } from 'stream/consumers';
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY || "OOPSY-DAISY";

import { roleCheck } from '../middleware/roleCheck';



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
 *         description: The user ID to authenticate
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
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 *       401:
 *         description: Authentication failed due to invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Document not found"
 *       500:
 *         description: Server encountered an unexpected condition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

loginRouter.post('/', async (req: Request, res: Response) => {
    try {
        //gets user from DB
        //we want to do this by matching by email
        //We should take the id out of the path and instead include email in the payload

        //Login process:
        /*
        Send data (email and password)
        Compare email
        IF email match exists, hash password, check if password matches
        IF password matches, return signed token and user data, log them in.

        BREAK anywhere - "Invalid credentials
        
        REVISION! hash password first to reduce weakness to cache-timing attacks
        */

        //const tryPword = await hasher(req.body.password);
        const user = await User.findOne({email:{$eq:req.body.email}}).populate('workplaceId')
        

        if (!user) {
            res.status(404).json({ message: "Document not found" });
        } else {
            //compare with stored value
            const validated = await bcrypt.compare(req.body.password, user.password);
            //check if failed - respond with invalid credentials if so
            if (!validated) {
                res.status(401).json({ message: "Invalid credentials" })
            } else {
                if (secretKey) {
                    //if successful, issue token, sign the user's privellege
                    const token = jwt.sign({role : user.role }, secretKey, { expiresIn: '1h' });
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
/**
 * @openapi
 * /login/{id}:
 *   get:
 *     summary: Retrieve a user by ID (protected)
 *     tags:
 *       - Login
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to retrieve
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: JWT token for authentication
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: A user object without password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Document not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

loginRouter.get('/:id', roleCheck("user"), async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('workplaceId');
        if (!user) { res.status(404).json({ message: "Document not found" }) } else {
            res.json(user);
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
})



    
export default loginRouter;




