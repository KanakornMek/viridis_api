const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: {
        type: String, 
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        unique: true,
        index: true,
        required: true
    },
    phoneNumber: String,
    verifyToken: String,
    isVerified: Boolean
})

const User = mongoose.model('User', userSchema, 'Users');

module.exports = User;