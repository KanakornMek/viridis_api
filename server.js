const express = require('express');
require('dotenv').config()
const app = express();

const port = 4000;

const tokenRouter = require('./routers/token')
const userRouter = require('./routers/user')

app.use('/token', tokenRouter);
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})