"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const incidentRouter = (0, express_1.Router)();
const incident_js_1 = require("../models/incident.js");
//GET (ALL)
incidentRouter.get('/', async (req, res) => {
    try {
        const incidents = await incident_js_1.Incident.find().populate(["reportedBy", "workplaceId"]);
        res.json(incidents);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// GET (ID)
incidentRouter.get('/:id', async (req, res) => {
    try {
        const incident = await incident_js_1.Incident.findById(req.params.id).populate(["reportedBy", "workplaceId"]);
        res.json(incident);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// CREATE
incidentRouter.post('/', async (req, res) => {
    //Instantiating a new person object to send to the database
    const incident = new incident_js_1.Incident({
        title: req.body.title,
        description: req.body.description,
        photoPath: req.body.photoPath,
        reportedBy: req.body.reportedBy,
        workplaceId: req.body.workplaceId,
        status: req.body.status,
        //NOTE: THIS IS THE MONGOOSE DATE TYPE
        createdAt: req.body.createdAt,
        riskLevel: req.body.riskLevel
    });
    try {
        const newIncident = await incident.save();
        res.json(newIncident);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// UPDATE
//NOTE: "can't set headers after response is sent to the client" error usually indicates you have competing responses
incidentRouter.patch('/:id', async (req, res) => {
    try {
        const incident = await incident_js_1.Incident.findById(req.params.id);
        if (incident) {
            let workingCopy = incident.toObject();
            for (let key of Object.keys(workingCopy)) {
                if (req.body[key] != null) {
                    incident[key] = req.body[key];
                }
            }
            const patchedIncident = await incident.save();
            res.json(patchedIncident);
        }
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// DELETE
incidentRouter.delete('/:id', async (req, res) => {
    try {
        await incident_js_1.Incident.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
exports.default = incidentRouter;
