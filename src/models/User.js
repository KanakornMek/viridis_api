const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    businessName: String,
    email: {
        type: String, 
        unique: true,
        index: true,
        required: true
    },
    phoneNumber: String,
    verifyToken: String,
    isVerified: Boolean,
    type: String,
    isServiceAcc: Boolean
})

const User = mongoose.model('User', userSchema, 'Users');

module.exports = User;