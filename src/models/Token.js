const mongoose = require('mongoose')
const tokenSchema= new mongoose.Schema({
    name: String,
    availableToken: Number,
    price: mongoose.Types.Decimal128
})
const tokenprice = mongoose.model('Token', tokenSchema, 'Token');
module.exports=tokenprice;