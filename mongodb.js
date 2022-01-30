//CRUD operations

// using destructure
const { MongoClient, ObjectID } = require('mongodb')

const connectionURI = 'mongodb://127.0.0.1:27017';
const dbName = 'task-app';

const id = new ObjectID();

MongoClient.connect(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {

    if (error) {
        console.log('Unable to connect db')
    }

    const db = client.db(dbName);

    //get coolection from DB
    // db.collection('users').findOne({'name':'Madhuri'},(error,user)=>{
    //     if(error){
    //         return console.log('unable to find')
    //     }
    //     return console.log(user)
    // })

    // get all coolection from DB
    // db.collection('users').find({ 'age': 27 }).toArray((error, result) => {
    //     if (error) {
    //         return console.log('unable to find')
    //     }
    //     return console.log(result)
    // })

    // const updateDoc =db.collection('users').updateOne({
    //     '_id':new ObjectID("6084352dc3d14c2d8df22f3d")
    // },
    // {
    //     $set:{
    //         'name': 'Maddy'
    //     }
    // })

    // updateDoc.then(res=>{
    //     return console.log(res);
    // }).catch((err) => {
    //     return console.log(err)
    // })

    //inserting data
    // db.collection('users').insertOne({
    //     name:'Madhuri',
    //     age:27
    // },(error,result)=>{
    //     if(error){
    //         console.log('Unable to insert item')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         'description': 'clean the house',
    //         'completed': true
    //     },
    //     {
    //         'description': 'Renew inspection',
    //         'completed': false
    //     },
    //     {
    //         'description': 'Pot plants',
    //         'completed': true
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log('unable to insert tasks')
    //     }
    //     return console.log(result.ops)
    // })


})