import { Request, Response, Router } from 'express';
const workplaceRouter: Router = Router();
import { IWorkplace, Workplace } from '../models/workplace';
import mongoose from 'mongoose';

//GET (ALL)

workplaceRouter.get('/', async (req: Request, res: Response) => {
    try {
        const workplaces: mongoose.Document[] = await Workplace.find();
        res.json(workplaces);
    } catch (err: any) {
        res.json({ message: err.message })
    }
})


// GET (ID)
workplaceRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const workplace = await Workplace.findById(req.params.id)
        res.json(workplace);
    } catch (err: any) {
        res.json({ message: err.message })
    }
});


// CREATE
workplaceRouter.post('/', async (req: Request, res: Response) => {

    //Instantiating a new person object to send to the database
    const workplace: mongoose.Document = new Workplace({
        name: req.body.name,
        location: req.body.location,
    })

    try {
        const newWorkplace: mongoose.Document = await workplace.save()
        res.json(newWorkplace)
    } catch (err: any) {
        res.json({ message: err.message })
    }
})


// UPDATE

//NOTE: "can't set headers after response is sent to the client" error usually indicates you have competing responses
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
        res.json({ message: err.message })
    }

})

// DELETE
workplaceRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await Workplace.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    } catch (err: any) {
        res.json({ message: err.message })
    }


})

export default workplaceRouter;