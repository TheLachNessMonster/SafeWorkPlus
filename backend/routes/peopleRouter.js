"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const peopleRouter = (0, express_1.Router)();
const person_js_1 = require("../models/person.js");
//document is the name of the individual instance of a mongoose schema object (?)
//GET (ALL)
peopleRouter.get('/', async (req, res) => {
    try {
        const people = await person_js_1.Person.find();
        res.json(people);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// GET (ID)
peopleRouter.get('/:id', async (req, res) => {
    try {
        const person = await person_js_1.Person.findById(req.params.id);
        res.json(person);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// CREATE
peopleRouter.post('/', async (req, res) => {
    //Instantiating a new person object to send to the database
    const person = new person_js_1.Person({
        name: req.body.name,
        age: req.body.age,
        occupation: req.body.occupation
    });
    try {
        const newPerson = await person.save();
        res.json(newPerson);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// UPDATE
//NOTE: "can't set headers after response is sent to the client" error usually indicates you have competing responses
peopleRouter.patch('/:id', async (req, res) => {
    try {
        const person = await person_js_1.Person.findById(req.params.id);
        if (person) {
            let workingCopy = person.toObject();
            for (let key of Object.keys(workingCopy)) {
                if (req.body[key] != null) {
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
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// DELETE
peopleRouter.delete('/:id', async (req, res) => {
    try {
        await person_js_1.Person.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
exports.default = peopleRouter;
