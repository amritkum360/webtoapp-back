const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the App model
const AppAdmobsSchema = new Schema({
    appid: {
        type: Schema.Types.ObjectId // Correct reference to ObjectId type
    },
    applicationid: {
        type: String
    },
    bannerid: {
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
