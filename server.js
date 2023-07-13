const express = require('express');
require('dotenv').config();
const verifyToken = require('./src/utils/verifyjwt')
const app = express();
app.use(express.json());
const port = 4000;
app.connect(process.env.MONGO_URL)
const tokenRouter = require('./src/routers/token')
const userRouter = require('./src/routers/user')

 
app.use('/', verifyToken);

const user= require('./src/model/user')
const wallet= require('./src/model/wallet')
const Transactions= require('./src/model/Transactions')

app.use('/token', tokenRouter);
app.use('/user', userRouter);

const a =await findbyId(Id).exec()
a.price
res.json(a)
const price = pricetoken.findone().exec()

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})