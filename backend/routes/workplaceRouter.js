"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workplaceRouter = (0, express_1.Router)();
const workplace_js_1 = require("../models/workplace.js");
//GET (ALL)
workplaceRouter.get('/', async (req, res) => {
    try {
        const workplaces = await workplace_js_1.Workplace.find();
        res.json(workplaces);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// GET (ID)
workplaceRouter.get('/:id', async (req, res) => {
    try {
        const workplace = await workplace_js_1.Workplace.findById(req.params.id);
        res.json(workplace);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// CREATE
workplaceRouter.post('/', async (req, res) => {
    //Instantiating a new person object to send to the database
    const workplace = new workplace_js_1.Workplace({
        name: req.body.name,
        location: req.body.location,
    });
    try {
        const newWorkplace = await workplace.save();
        res.json(newWorkplace);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// UPDATE
//NOTE: "can't set headers after response is sent to the client" error usually indicates you have competing responses
workplaceRouter.patch('/:id', async (req, res) => {
    try {
        const workplace = await workplace_js_1.Workplace.findById(req.params.id);
        if (workplace) {
            let workingCopy = workplace.toObject();
            for (let key of Object.keys(workingCopy)) {
                if (req.body[key] != null) {
                    workplace[key] = req.body[key];
                }
            }
            const patchedWorkplace = await workplace.save();
            res.json(patchedWorkplace);
        }
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// DELETE
workplaceRouter.delete('/:id', async (req, res) => {
    try {
        await workplace_js_1.Workplace.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
exports.default = workplaceRouter;
