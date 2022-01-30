const express = require('express');
require('./db/mongoose');
const Task = require('./model/task');
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const taskrouter = require('./routers/task');

app.use(express.json());
app.use(userRouter);
app.use(taskrouter);


app.listen(port, () => {
    console.log('server is up on port ', port)
})