require('../src/db/mongoose');
const User = require('../src/model/user');

// User.findByIdAndUpdate('61ed07e1790e2a2d63742f4b',{age:1}).then(user=>{
//     console.log(user);
//     return User.countDocuments({age:1})
// }).then(result=>{
//     console.log(result)
// }).catch(e=>{
//     console.log(e)
// });


const userUpdateandCount = async (id,age) =>{
    const user = await User.findByIdAndUpdate(id,{age});
    const count = await User.countDocuments({age});
    return count;
}

userUpdateandCount('61ed07e1790e2a2d63742f4b',2).then(result=>{
    console.log(result)
}).catch(e=>{
    console.log(e)
})