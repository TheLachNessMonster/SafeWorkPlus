import { Request, Response, Router } from 'express';
const incidentRouter: Router = Router();
import { IIncident, Incident } from '../models/incident';
import mongoose from 'mongoose';




/**
 * @openapi
 * /incidents:
 *   get:
 *     summary: Retrieve a list of all incidents
 *     tags:
 *       - Incidents
 *     responses:
 *       200:
 *         description: A list of incident records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Incident'
 *       404:
 *         description: No incidents found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server encountered an unexpected condition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

incidentRouter.get('/', async (req: Request, res: Response) => {
    try {
        const incidents: mongoose.Document[] = await Incident.find().populate(["reportedBy", "workplaceId"]);
        if (!incidents) {
            res.status(404).json({ message: "Document not found" })
        } else {
            res.json(incidents);
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
})




/**
 * @openapi
 * /incidents/{id}:
 *   get:
 *     summary: Retrieve a single incident by ID
 *     tags:
 *       - Incidents
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the incident to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single incident record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incident'
 *       404:
 *         description: Incident not found
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

incidentRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const incident = await Incident.findById(req.params.id).populate(["reportedBy", "workplaceId"]);
        if (!incident) {
            res.status(404).json({ message: "Document not found" })
        } else {
            res.json(incident);
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
});



/**
 * @openapi
 * /incidents:
 *   post:
 *     summary: Create a new incident
 *     tags:
 *       - Incidents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - photoPath
 *               - reportedBy
 *               - workplaceId
 *               - status
 *               - createdAt
 *               - riskLevel
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               photoPath:
 *                 type: string
 *               reportedBy:
 *                 type: string
 *               workplaceId:
 *                 type: string
 *               status:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               riskLevel:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created incident
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incident'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: title is required"
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

incidentRouter.post('/', async (req: Request, res: Response) => {

    const incident: mongoose.Document = new Incident({
        title: req.body.title,
        description: req.body.description,
        photoPath: req.body.photoPath,
        reportedBy: req.body.reportedBy,
        workplaceId: req.body.workplaceId,
        status: req.body.status,
        //NOTE: THIS IS THE MONGOOSE DATE TYPE
        createdAt: req.body.createdAt,
        riskLevel: req.body.riskLevel
    })

    try {
        const newIncident: mongoose.Document = await incident.save()
        res.status(201).json(newIncident)
    } catch (err: any) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: err.message })
        } else {
            res.status(500).json({ message: err.message })
        }
    }
})




/**
 * 
 * Updates document using PATCH.  
 * Type assertion used allows looping instead of direct mapping as service layer ensures PATCH req body takes shape of router type
 * Future refactoring will make this algorithm generic and modular
 */
/**
 * @openapi
 * /incidents/{id}:
 *   patch:
 *     summary: Update incident fields by ID
 *     tags:
 *       - Incidents
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the incident to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               photoPath:
 *                 type: string
 *               reportedBy:
 *                 type: string
 *               workplaceId:
 *                 type: string
 *               status:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               riskLevel:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated incident
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Incident'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed: title is required"
 *       404:
 *         description: Incident not found
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



incidentRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (incident) {
            let workingCopy = incident.toObject();
            for (let key of Object.keys(workingCopy) as (keyof IIncident)[]) {
                if (req.body[key] != null) {
                    incident[key] = req.body[key];
                }
            }

            const patchedIncident = await incident.save();
            res.json(patchedIncident);
        } else {
            res.status(404).json({ message: "Document not found" })
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
 * /incidents/{id}:
 *   delete:
 *     summary: Delete an incident by ID
 *     tags:
 *       - Incidents
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the incident to delete
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
 *         description: Incident not found
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

incidentRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        let target = await Incident.findByIdAndDelete(req.params.id);
        if(!target){
            res.status(404).json({ message: "Document not found" })
        }else{
        res.json({ message: "Deletion successful" });
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }


})




export default incidentRouter;




//Why does this duplicate function exist?
// incidentRouter.get('/workplace/:workplaceId', async (req: Request, res: Response) => {
//   try {
//     const incidents = await Incident.find({ workplaceId: req.params.workplaceId })
//       .populate(["reportedBy", "workplaceId"])
//       .sort({ createdAt: -1 });
//     res.status(200).json(incidents);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// });


// CREATE

