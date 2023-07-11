const express = require('express');
require('dotenv').config()
const app = express();

const port = 4000;
app.connect(process.env.MONGO_URL)
const tokenRouter = require('./routers/token')
const userRouter = require('./routers/user')

const user= require('./model/user')
const wallet= require('./model/wallet')
const Session= require('./model/Session')
const Transactions= require('./model/Transactions')
const Auth=require('./model/Auth')
app.use('/token', tokenRouter);
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})