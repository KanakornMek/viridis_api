const mongoose = require('mongoose');
const Schema = mongoose.Schema

const serviceAccSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    businessName: String,
    businessType: String,
})

const ServiceAcc = mongoose.model('ServiceAcc', serviceAccSchema, 'ServiceAccs');

module.exports = ServiceAcc;