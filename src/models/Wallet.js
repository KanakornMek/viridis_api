const mongoose = require('mongoose')
const walletschema= new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    totalPoints:Number,
    totalTokens:Number
})
const wallet = mongoose.model('wallet',walletschema);
module.exports=wallet;