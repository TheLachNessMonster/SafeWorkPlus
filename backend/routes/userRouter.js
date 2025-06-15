"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
const user_js_1 = require("../models/user.js");
//GET (ALL)
userRouter.get('/', async (req, res) => {
    try {
        const users = await user_js_1.User.find().populate('workplaceId');
        res.json(users);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// GET (ID)
userRouter.get('/:id', async (req, res) => {
    try {
        const user = await user_js_1.User.findById(req.params.id).populate('workplaceId');
        res.json(user);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// CREATE
userRouter.post('/', async (req, res) => {
    //Instantiating a new person object to send to the database
    const user = new user_js_1.User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        workplaceId: req.body.workplaceId
    });
    try {
        const newUser = await user.save();
        res.json(newUser);
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// UPDATE
//NOTE: "can't set headers after response is sent to the client" error usually indicates you have competing responses
userRouter.patch('/:id', async (req, res) => {
    try {
        const user = await user_js_1.User.findById(req.params.id);
        if (user) {
            let workingCopy = user.toObject();
            for (let key of Object.keys(workingCopy)) {
                if (req.body[key] != null) {
                    user[key] = req.body[key];
                }
            }
            //const patchedUser = await user.save();
            await user.save();
            const patchedUser = await user_js_1.User.findById(req.params.id).populate('workplaceId');
            res.json(patchedUser);
        }
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
// DELETE
userRouter.delete('/:id', async (req, res) => {
    try {
        await user_js_1.User.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletion successful" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
});
exports.default = userRouter;
