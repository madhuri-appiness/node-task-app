const express = require('express');
const taskrouter = new express.Router();
const Task = require("../model/task");
const auth = require("../middleware/auth");

taskrouter.get('/tasks',auth, async (req, res) => {
    try{
        // const tasks = await Task.findOne({});
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

taskrouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // here we can pass only one paramether for this method
        // const task = await Task.findById(_id);

        const task = await Task.findOne({_id,owner:req.user._id})
        if (!task) {
            res.status(404).send();
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


taskrouter.post('/tasks', auth, (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    // const task = new Task(req.body);
    task.save().then(() => {
        res.send(task);
    }).catch(e => {
        res.status(400).send(e)
    })
})

taskrouter.patch('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["completed", "description"];
    const isValidUpdate = updates.every(key => allowedUpdates.includes(key));
    if (!isValidUpdate) {
        res.status(404).send({ error: 'Invalid update' })
    }
    try {
        // direct update in db
        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        const task = await Task.findOne({_id,owner:req.user._id});

        if (!task) {
            res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save();

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

taskrouter.delete('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id,owner:req.user._id});
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = taskrouter;