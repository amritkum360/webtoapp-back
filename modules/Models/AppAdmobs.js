const mongoose = require('mongoose');
// const { type } = require('os');

// Define the schema for the App model
const AppAdmobsSchema = new mongoose.Schema({
    appid:{
        type: String
    },
    applicationid:{
        type: String
    },
    bannerid:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the App model based on the schema
const AppAdmobs = mongoose.model('AppAdmobs', AppAdmobsSchema);

module.exports = AppAdmobs;
