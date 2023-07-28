const Token = require('./src/models/Token');
require('dotenv').config();
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on('connected', () => {
    console.log('connected to database')
})

const transactions = require('./src/models/Transactions');
const newtan = new transactions({
    purchaseDate : new Date(),
    userId :new mongoose.Types.ObjectId('64acd189fa3ec41b59f7ac0d'),
    totalPrice :5,
    amtToken :65

})


setTimeout(() => newtan.save(), 5000)
