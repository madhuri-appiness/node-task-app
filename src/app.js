const express = require('express');
require('./db/mongoose');


const app = express();
const userRouter = require('./routers/user');
const taskrouter = require('./routers/task');


app.use(express.json());
app.use(userRouter);
app.use(taskrouter);


module.exports= app;
