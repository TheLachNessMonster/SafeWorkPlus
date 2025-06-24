import { Request, Response, Router } from 'express';
const incidentRouter: Router = Router();
import { IIncident, Incident } from '../models/incident';
import mongoose from 'mongoose';




/**
 * GET all, serialise as list
 */
incidentRouter.get('/', async (req: Request, res: Response) => {
    try {
        const incidents: mongoose.Document[] = await Incident.find().populate(["reportedBy", "workplaceId"]);
        res.json(incidents);
    } catch (err: any) {
        res.json({ message: err.message })
    }
})




/**
 *GET by ID
 */
incidentRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const incident = await Incident.findById(req.params.id).populate(["reportedBy", "workplaceId"]);
        res.json(incident);
    } catch (err: any) {
        res.json({ message: err.message })
    }
});




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




/**
 * POST a new document of router 'type' to DB
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
        res.json(newIncident)
    } catch (err: any) {
        res.json({ message: err.message })
    }
})




/**
 * Updates document using PATCH.  
 * Type assertion used allows looping instead of direct mapping as service layer ensures PATCH req body takes shape of router type
 * Future refactoring will make this algorithm generic and modular
 */
incidentRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (incident) {
            let workingCopy = incident.toObject();
            for (let key of Object.keys(workingCopy) as (keyof IIncident)[]) {
                if(req.body[key]!= null){
                    incident[key] = req.body[key];
                }
            }

            const patchedIncident = await incident.save();
            res.json(patchedIncident);
        }
    } catch (err: any) {
        res.json({ message: err.message })
    }

})




/**
 * DELETE document from DB by ID/
 */
incidentRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await Incident.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    } catch (err: any) {
        res.json({ message: err.message })
    }


})




export default incidentRouter;