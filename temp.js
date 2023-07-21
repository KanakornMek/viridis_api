const Token = require('./src/models/Token');
require('dotenv').config();
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on('connected', () => {
    console.log('connected to database')
})

const newToken = new Token({
    name: 'viridis token',
    availableToken: 100000,
    price: 1
})
setTimeout(() => newToken.save(), 5000)
