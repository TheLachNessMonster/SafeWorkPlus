import { Request, Response, Router } from 'express';
const workplaceRouter: Router = Router();
import { IWorkplace, Workplace } from '../models/workplace';
import mongoose from 'mongoose';
import { roleCheck } from '../middleware/roleCheck';




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
 *       404:
 *         description: No workplaces found
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

workplaceRouter.get('/', roleCheck("user", "foreman"), async (req: Request, res: Response) => {
    try {
        const workplaces: mongoose.Document[] = await Workplace.find();
        if (!workplaces.length) { res.status(404).json({ message: "Document not found" }) } else {
            res.json(workplaces);
        }

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
 *         description: The ID of the workplace to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A workplace object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workplace'
 *       404:
 *         description: Workplace not found
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

workplaceRouter.get('/:id', roleCheck("user", "foreman"), async (req: Request, res: Response) => {
    try {
        const workplace = await Workplace.findById(req.params.id)
        if (!workplace) { res.status(404).json({ message: "Document not found" }) } else {
            res.json(workplace);
        }
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
 *       500:
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

workplaceRouter.post('/', roleCheck("admin"), async (req: Request, res: Response) => {

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
 *         description: The ID of the workplace to update
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
 *       404:
 *         description: Workplace not found
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

workplaceRouter.patch('/:id', roleCheck("admin"), async (req: Request, res: Response) => {
    try {
        const workplace = await Workplace.findById(req.params.id);
        if (workplace) {
            let workingCopy = workplace.toObject();
            for (let key of Object.keys(workingCopy) as (keyof IWorkplace)[]) {
                if (req.body[key] != null) {
                    workplace[key] = req.body[key];
                }
            }

            const patchedWorkplace = await workplace.save();
            res.json(patchedWorkplace);
        } else { res.status(404).json({ message: "Document not found" }) }


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
 *                   example: Deletion successful
 *       404:
 *         description: Workplace not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Document not found
 *       500:
 *         description: Server encountered an unexpected condition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

workplaceRouter.delete('/:id', roleCheck("admin"), async (req: Request, res: Response) => {
    try {
        let target = await Workplace.findByIdAndDelete(req.params.id);
        if (!target) { res.status(404).json({ message: "Document not found" }) } else {
            res.json({ message: "Deletion successful" });
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }


})




export default workplaceRouter;