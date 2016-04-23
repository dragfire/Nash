/**
 * Created by dragfire on 21-04-2016.
 */

var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
    name: String,
    privacy: String, // public or private room
    created: Date
});

exports.Room = mongoose.model('Room', RoomSchema);

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    id: String,
    password: String
});


exports.Users = mongoose.model('Users', UserSchema);

var ChatSchema = new mongoose.Schema({
    created: Date,
    content: String,
    username: String,
    room: String
});

exports.Chat = mongoose.model('Chat', ChatSchema);
