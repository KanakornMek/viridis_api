const mongoose = require('mongoose')
const Transactionsschema =new mongoose.Schema({
    userId : mongoose.Types.ObjectId,
    purchaseDate: Date,
    tokenPrice :Number,
    amtToken:Number,
    totalPrice:Number,
    point:Number,
    paymentId: String,
    status: String,
})
const Transactions =mongoose.model('Transaction',Transactionsschema);
module.exports=Transactions;