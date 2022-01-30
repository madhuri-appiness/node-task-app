const express = require('express');
const taskrouter = new express.Router();
const Task = require("../model/task");

taskrouter.get('/tasks', (req, res) => {
    Task.find({}).then(task => {
        if (!task) {
            res.status(404).send();
        }
        res.send(task)
    }).catch(e => {
        res.status(500).send(e)
    })
})

taskrouter.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;
    Task.findById(_id).then(task => {
        if (!task) {
            res.status(404).send();
        }
        res.send(task)
    }).catch(e => {
        res.status(500).send(e)
    })
})


taskrouter.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.send(task);
    }).catch(e => {
        res.status(400).send(e)
    })
})

taskrouter.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["completed","description"];
    const isValidUpdate = updates.every(key=> allowedUpdates.includes(key));
    if(!isValidUpdate){
        res.status(404).send({error:'Invalid update'})
    }
    try {
        // direct update in db
        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        const task = await Task.findById(_id);
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save();
        if (!task) {
            res.status(404).send();
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

taskrouter.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = taskrouter;