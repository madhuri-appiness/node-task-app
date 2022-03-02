const app = require('./app')
const port = process.env.PORT;

app.listen(port, () => {
    console.log('server is up on port ', port)
})


// const Task = require('./model/task');
// const User = require('./model/user');

// const main= async ()=>{
//     // const task = await Task.findById('61fbe995bd52884d5b678590');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner)

//     // const user = await User.findById('61fbca6c7c588e198a07edc6');
//     // await user.populate('tasks').execPopulate();
//     // console.log(user.tasks)
// }

// main()