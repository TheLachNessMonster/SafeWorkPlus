import { Request, Response, Router } from 'express';
const incidentRouter: Router = Router();
import { IIncident, Incident } from '../models/incident';
import mongoose from 'mongoose';


//GET incidents filtered by workplace
incidentRouter.get('/workplace/:workplaceId', async (req: Request, res: Response) => {
  try {
    const incidents = await Incident.find({ workplaceId: req.params.workplaceId })
      .populate(["reportedBy", "workplaceId"])
      .sort({ createdAt: -1 });
    res.status(200).json(incidents);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

//TODO: PUT update incident status

//GET (ALL)
incidentRouter.get('/', async (req: Request, res: Response) => {
    try {
        const incidents: mongoose.Document[] = await Incident.find().populate(["reportedBy", "workplaceId"]);
        res.json(incidents);
    } catch (err: any) {
        res.json({ message: err.message })
    }
})


// GET (ID)
incidentRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const incident = await Incident.findById(req.params.id).populate(["reportedBy", "workplaceId"]);
        res.json(incident);
    } catch (err: any) {
        res.json({ message: err.message })
    }
});


// CREATE
incidentRouter.post('/', async (req: Request, res: Response) => {

    //Instantiating a new person object to send to the database
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

//NOTE: "can't set headers after response is sent to the client" error usually indicates you have competing responses
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

// DELETE
incidentRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await Incident.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    } catch (err: any) {
        res.json({ message: err.message })
    }


})

export default incidentRouter;