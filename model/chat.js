/**
 * Created by dragfire on 21-04-2016.
 */

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    created: Date,
    content: String,
    username: String,
    room: String
});

module.exports = mongoose.model('Chat', schema);