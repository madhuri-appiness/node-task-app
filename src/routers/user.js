const express = require('express');
const router = new express.Router();
const User = require('../model/user');

//create user
// CRUD operation using async and await
router.post('/users', async (req, res) => {
    const user = await new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch(e => {
    //     res.status(400).send(e);
    // })
})

//login user
router.post('/users/login', async (req,res)=>{
    try{
        const user = await User.findCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken()
        res.send({user,token});
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (e) {
        res.send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/:id',async(req,res)=>{
    const _id = req.params.id;
    const updates=Object.keys(req.body);
    const allowedUpdates=['age','name','email','password'];

    const isValidUpdate = updates.every(key=>allowedUpdates.includes(key));

    if(!isValidUpdate){
        res.status(404).send({error:'Invalid update'})
    }
    try{
        //below direct update in db
        // const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});
        const user = await User.findById(_id);

        updates.forEach((update)=>user[update] = req.body[update]);
        await user.save()

        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})


router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router;