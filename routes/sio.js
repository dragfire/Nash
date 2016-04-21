/**
 * Created by dragfire on 21-04-2016.
 */
var debug = require('debug')('NASH: SIO');
var schemas = require('../model/schemas');

var sio = function (io) {
    var defaultRoom = 'general';
    var rooms = ["general", "angular", "socket.io", "express", "node", "mongo"];
    
    io.on('connection', function (socket) {
        socket.emit('setup', {
            rooms: rooms
        });

        socket.on('new user', function (data) {
            data.room = defaultRoom;
            socket.join(defaultRoom);
            io.in(defaultRoom).emit('user joined', data);
        });

        socket.on('switch room', function (data) {
            debug('Switch Room', data);
            socket.leave(data.oldRoom);
            socket.join(data.newRoom);
            io.in(data.oldRoom).emit('user left', data);
            io.in(data.newRoom).emit('user joined', data);
        });

        socket.on('new message', function (data) {
            var msg = new schemas.Chat({
                username: data.username,
                content: data.message,
                room: data.room.toLowerCase(),
                created: new Date()
            });

            msg.save(function (err, msg) {
                io.in(msg.room).emit('message created', msg);
            });
        });
    });


    
};

module.exports = sio;