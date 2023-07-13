const mongoose = require('mongoose')
const Transactionsschema =new mongoose.Schema({
    userId : mongoose.Types.ObjectId,
    purchaseDate: Date,
    tokenPrice :mongoose.Types.Decimal128,
    amtToken:String,
    totalPrice:Number,
    point:Number,
    paymentId :Number

})
const Transactions =mongoose.model('Transaction',Transactionsschema);
module.exports=Transactions;