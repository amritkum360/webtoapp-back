const mongoose = require('mongoose');
const { type } = require('os');

// Define the schema for the App model
const paymentdataSchema = new mongoose.Schema({
    appId:{
        type: String
    },
    orderId:{
        type: String
    },
    paymentId:{
        type:String
    },
    amount:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the App model based on the schema
const paymentdatas = mongoose.model('paymentdatas', paymentdataSchema);

module.exports = paymentdatas;
