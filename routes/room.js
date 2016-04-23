var express = require('express');
var router = express.Router();
var schemas = require('../model/schemas');
var debug = require('debug')('NASH: Room');
//var base = require('base64');

router
    .route('/')
    .post(function (req, res) {
        debug(req.body);
        var username = req.body.username;
        var privacy = req.body.roomprivacy;
        var room = req.body.roomname.toLowerCase();
        var newRoom = new schemas.Room({
            name: room,
            privacy: privacy,
            created: new Date()
        });

        schemas.Room.find({name: room, privacy: privacy}).exec(function (err, result) {
            if (err) throw err;
            debug('Check', result);
            if (!result.length)
                newRoom.save(function (err, doc) {
                    debug('Saved', doc);
                });
        });
        debug('Invite Url:', '/chat/'+privacy+'/'+room+'?username='+username+'&invite=no');
        res.redirect('/chat/'+privacy+'/'+room+'?username='+username+'&invite=no');
    })
    .get(function (req, res) {
        res.render('room', {title: 'Create Room | NASH'});
    });

module.exports = router;