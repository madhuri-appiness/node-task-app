const express = require('express');
const router = new express.Router();
const User = require('../model/user');
//middleware for authentication for all routes
const auth = require('../middleware/auth');

//create user
// CRUD operation using async and await
router.post('/users', async (req, res) => {
    const user = await new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
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
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    //getting user from req header after authentication is done in auth middleware
    res.send(req.user);
})


router.patch('/users/me',auth, async (req, res) => {
    // we are getting user by auth middleware so no use of id
    // const _id = req.user.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['age', 'name', 'email', 'password'];

    const isValidUpdate = updates.every(key => allowedUpdates.includes(key));

    if (!isValidUpdate) {
        res.status(404).send({ error: 'Invalid update' })
    }
    try {
        //below direct update in db
        // const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});

        // we are getting user by auth middleware
        const user = req.user;

        updates.forEach((update) => user[update] = req.body[update]);
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();

        res.send()
    }
    catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user.id;
    try {
        // const user = await User.findByIdAndDelete(_id);
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router;