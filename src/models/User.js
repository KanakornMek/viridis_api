const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    companyName: String,
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
    serviceAcc: Boolean,
    serviceId: mongoose.Schema.Types.ObjectId,
})

const User = mongoose.model('User', userSchema, 'Users');

module.exports = User;