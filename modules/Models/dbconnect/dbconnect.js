const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/webtoapp').then(() => {
    console.log('Database connected successfully');
}).catch((error) => {
    console.error('Error connecting to database:', error);
});

module.exports = mongoose.connection;
