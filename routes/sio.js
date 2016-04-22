/**
 * Created by dragfire on 21-04-2016.
 */
var debug = require('debug')('NASH: SIO');
var schemas = require('../model/schemas');

var sio = function (io) {
    var defaultRoom = 'general';
    var rooms = ["general", "angular", "socket.io", "express", "node", "mongo"];
    
    io.on('connection', function (socket) {
        debug('new connection', socket.id, socket.rooms, socket.sockets);
        socket.emit('setup', {
            rooms: rooms
        });

        socket.on('new user', function (data) {
            data.room = defaultRoom;
            socket.join(defaultRoom);
            io.in(defaultRoom).emit('user joined', data);
        });

        socket.on('switch room', function (data) {
            //debug('Switch Room', data);
            socket.leave(data.oldRoom);
            socket.join(data.newRoom);
            io.in(data.oldRoom).emit('user left', data);
            io.in(data.newRoom).emit('user joined', data);
        });

        socket.on('new message', function (data) {
            debug("New Message", data);
            var msg = new schemas.Chat({
                username: data.username,
                content: data.message,
                room: data.room.toLowerCase(),
                created: new Date()
            });

            msg.save(function (err, msg) {
                //debug("Saved",msg);
                io.in(msg.room).emit('message created', msg);
            });
        });

        socket.on('user typing', function (data) {
            io.in(data.room).emit('typing', data);
        });

        socket.on('stopped typing', function (data) {
            io.in(data.room).emit('no typing', data);
        });
    });


    
};

module.exports = sio;