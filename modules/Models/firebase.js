const mongoose = require('mongoose');
// const { type } = require('os');

// Define the schema for the App model
const FirebaseSchema = new mongoose.Schema({
    appid:{
        type: String
    },
    firebaseconf:{
        type: String
    },
    fcmsecuritykey:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the App model based on the schema
const firebases = mongoose.model('firebases', FirebaseSchema);

module.exports = firebases;
