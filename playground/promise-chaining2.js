require('../src/db/mongoose');
const Task = require('../src/model/task');

// Task.findByIdAndDelete('61e6f0ed3d57fe3392c16737').then(task=>{
//     console.log(task);
//     return Task.countDocuments({completed:false})
// }).then(result=>{
//     console.log(result)
// }).catch(e=>{
//     console.log(e)
// })


const taskDeletandCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}

taskDeletandCount('61e6f0ed3d57fe3392c16737').then(res => {
    console.log(res)
}).catch(e => {
    console.log(e)
})