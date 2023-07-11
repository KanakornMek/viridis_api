const mongoose = require('mongoose')
const Authschema= new mongoose.Schema({
    userId:Number,
    email:String,
    hashedPassword:String
})
const Auth = mongoose.model('Auth',Authschema);
module.exports(Auth);