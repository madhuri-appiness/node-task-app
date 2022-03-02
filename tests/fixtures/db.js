const mongoose = require('mongoose');
const User = require('../../src/model/user');
const Task = require('../../src/model/task');
const jwt = require('jsonwebtoken');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "basuraj",
    email: "basuraj@gmail.com",
    password: "basu@90",
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    ]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "maddy",
    email: "madhuri@gmail.com",
    password: "maddy@94",
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
        }
    ]
}


const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'My 1st task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'My 2nd task',
    completed: false,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'My 3nd task',
    completed: false,
    owner: userTwo._id
}

const setUpDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();


}


module.exports = {
    userOne,
    userOneId,
    setUpDatabase,
    taskOne,
    taskTwo,
    taskThree,
    userTwo,
    userTwoId
}