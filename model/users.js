var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: String,
    email: String,
    id: String,
    password: String
});


module.exports = Users = mongoose.Model('Users', schema);