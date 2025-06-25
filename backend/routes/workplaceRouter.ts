import { Request, Response, Router } from 'express';
const workplaceRouter: Router = Router();
import { IWorkplace, Workplace } from '../models/workplace';
import mongoose from 'mongoose';




/**
 * @openapi
 * /workplaces:
 *   get:
 *     summary: Retrieve a list of all workplaces
 *     tags:
 *       - Workplaces
 *     responses:
 *       200:
 *         description: A list of workplaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workplace'
 */
workplaceRouter.get('/', async (req: Request, res: Response) => {
    try {
        const workplaces: mongoose.Document[] = await Workplace.find();
        res.json(workplaces);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
})




/**
 * @openapi
 * /workplaces/{id}:
 *   get:
 *     summary: Retrieve a workplace by ID
 *     tags:
 *       - Workplaces
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A workplace object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workplace'
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
workplaceRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const workplace = await Workplace.findById(req.params.id)
        res.json(workplace);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
});



/**
 * @openapi
 * /workplaces:
 *   post:
 *     summary: Create a new workplace
 *     tags:
 *       - Workplaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created workplace
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workplace'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: name is required"
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

workplaceRouter.post('/', async (req: Request, res: Response) => {

    //Instantiating a new person object to send to the database

    const workplace: mongoose.Document = new Workplace({
        name: req.body.name,
        location: req.body.location,
    })

    try {
        const newWorkplace: mongoose.Document = await workplace.save()
        res.status(201).json(newWorkplace)
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
 * /workplaces/{id}:
 *   patch:
 *     summary: Update fields of a workplace by ID
 *     tags:
 *       - Workplaces
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
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated workplace
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workplace'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: name is required"
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
workplaceRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const workplace = await Workplace.findById(req.params.id);
        if (workplace) {
            let workingCopy = workplace.toObject();
            for (let key of Object.keys(workingCopy) as (keyof IWorkplace)[]) {
                if(req.body[key]!= null){
                    workplace[key] = req.body[key];
                }
            }

            const patchedWorkplace = await workplace.save();
            res.json(patchedWorkplace);
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
 * /workplaces/{id}:
 *   delete:
 *     summary: Delete a workplace by ID
 *     tags:
 *       - Workplaces
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
workplaceRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await Workplace.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }


})




export default workplaceRouter;