const express = require('express');
require('./db/mongoose');
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require('./routers/user');
const taskrouter = require('./routers/task');

// app.use((req,res,next)=>{
//    res.status(503).send('Site is currently down, check back later!')
//     // next()
// })

app.use(express.json());
app.use(userRouter);
app.use(taskrouter);


app.listen(port, () => {
    console.log('server is up on port ', port)
})


const Task = require('./model/task');
const User = require('./model/user');

const main= async ()=>{
    // const task = await Task.findById('61fbe995bd52884d5b678590');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner)

    // const user = await User.findById('61fbca6c7c588e198a07edc6');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks)
}

main()