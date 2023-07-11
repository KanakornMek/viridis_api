const mongoose = require('mongoose')
const userschema =new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber :String,
    email : String,
    ID : String

})
const user =mongoose.model('user',userschema);
module.exports(user);