const mongoose = require('mongoose')
const tokenSchema= new mongoose.Schema({
    name: String,
    availableToken: Number,
    price: Number
})
const tokenprice = mongoose.model('Token', tokenSchema, 'Token');
module.exports=tokenprice;