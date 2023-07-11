const mongoose = require('mongoose')
const walletschema= new mongoose.Schema({
    
    totalPoints:Number,
    totalTokens:Number
})
const wallet = mongoose.model('wallet',walletschema);
module.exports(wallet);