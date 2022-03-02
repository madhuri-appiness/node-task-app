const express = require('express');
const router = new express.Router();
const User = require('../model/user');
const multer = require('multer');
const sharp = require('sharp')

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


router.patch('/users/me', auth, async (req, res) => {
    // we are getting user by auth middleware so no use of id
    // const _id = req.user.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['age', 'name', 'email', 'password'];

    const isValidUpdate = updates.every(key => allowedUpdates.includes(key));

    if (!isValidUpdate) {
        res.status(400).send({ error: 'Invalid update' })
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
        res.status(400).send()
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

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error("Please upload a image"))
        }
        // callback(new Error("File must be a PDF"));
        callback(undefined, true)
    }
})

//upload profile pic for user
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send();
    }
})

module.exports = router;