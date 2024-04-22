const mongoose = require('mongoose');
const { Schema } = mongoose;


const splashScreenSchema = new mongoose.Schema({
  splashScreenLogo: String,
  splashScreenTimeout: String,
  customizeStatusBar: String,
  statusBarBackgroundColor: String,
  statusBarIconColor: String,
  appId: {
    type: Schema.Types.ObjectId // Correct reference to ObjectId type
},
});

// Create the App model based on the schema
const splashscreens = mongoose.model('splashscreens', splashScreenSchema);

module.exports = splashscreens;
