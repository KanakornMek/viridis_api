const mongoose = require('mongoose')
const Transactionsschema =new mongoose.Schema({
    
    purchaseDate: Date,
    tokenPrice :Number,
    amtToken:String,
    totalPrice:Number,
    point:Number,
    paymentId :Number

})
const Transactions =mongoose.model('Transaction',Transactionsschema);
module.exports(Transactions);