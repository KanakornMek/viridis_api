const mongoose = require('mongoose')
const Sessionschema= new mongoose.Schema({
    
    refreshToken :String,
    firstLogin :Date,
    lastAccess :Date
})
const Session = mongoose.model('Session',Sessionschema);
module.exports(Session);