import { Request, Response, Router } from 'express';
const peopleRouter: Router = Router();
import { IPerson, Person } from '../models/person.js';
import mongoose from 'mongoose';
//document is the name of the individual instance of a mongoose schema object (?)

//GET (ALL)

peopleRouter.get('/', async (req: Request, res: Response) => {
    try {
        const people: mongoose.Document[] = await Person.find();
        res.json(people);
    } catch (err: any) {
        res.json({ message: err.message })
    }
})


// GET (ID)
peopleRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const person = await Person.findById(req.params.id)
        res.json(person);
    } catch (err: any) {
        res.json({ message: err.message })
    }
});


// CREATE
peopleRouter.post('/', async (req: Request, res: Response) => {

    //Instantiating a new person object to send to the database
    const person: mongoose.Document = new Person({
        name: req.body.name,
        age: req.body.age,
        occupation: req.body.occupation
    })

    try {
        const newPerson: mongoose.Document = await person.save()
        res.json(newPerson)
    } catch (err: any) {
        res.json({ message: err.message })
    }
})


// UPDATE

//NOTE: "can't set headers after response is sent to the client" error usually indicates you have competing responses
peopleRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const person = await Person.findById(req.params.id);
        if (person) {
            let workingCopy = person.toObject();
            for (let key of Object.keys(workingCopy) as (keyof IPerson)[]) {
                if(req.body[key]!= null){
                    person[key] = req.body[key];
                }
            }
            // if (req.body.name != null) {
            //     person.name = req.body.name;
            // }
            // if (req.body.age != null) {
            //     person.age = req.body.age
            // }
            // if (req.body.occupation != null) {
            //     person.occupation = req.body.occupation
            // }
            const patchedPerson = await person.save();
            res.json(patchedPerson);
        }
    } catch (err: any) {
        res.json({ message: err.message })
    }

})

// DELETE
peopleRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await Person.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    } catch (err: any) {
        res.json({ message: err.message })
    }


})

export default peopleRouter;