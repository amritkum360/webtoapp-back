const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Amritkum360:7004343011@cluster0.1bafcyc.mongodb.net/webtoapp').then(() => {
    console.log('Database connected successfully');
}).catch((error) => {
    console.error('Error connecting to database:', error);
});

module.exports = mongoose.connection;
