const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceTransSchema = new Schema({
    serviceId: mongoose.Schema.Types.ObjectId,
    amtToken: Number
})


const serviceTrans = mongoose.model('ServiceTrans', serviceTransSchema);
module.exports = serviceTrans;