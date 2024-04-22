const mongoose = require('mongoose');
const { type } = require('os');

// Define the schema for the App model
const appSchema = new mongoose.Schema({
    website: {
        type: String,
        required: true
    },
    appName: {
        type: String,
        required: true
    },
    appPlatform: {
        type: String,
        enum: ['android', 'ios'], // Ensure appPlatform can only be 'android' or 'ios'
        required: true
    },
    user:{
        type: String
    },
    appicon:{
        type: String
    },
    plan:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the App model based on the schema
const App = mongoose.model('App', appSchema);

module.exports = App;
