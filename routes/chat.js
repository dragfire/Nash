var express = require('express');
var router = express.Router();
var schemas = require('../model/schemas');
var debug = require('debug')('HORNET Chat');

router.get('/:privacy?/:room?', function (req, res) {
    debug(req.query.username);
    var uname = req.query.username;
    var privacy = req.params.privacy;
    var room = req.params.room;
    var invitation = req.query.invite;

    debug(req.url);
    if (privacy && room && invitation && uname) {
        // switch (privacy){
        //     case 'public':
        //         public_chat(req, res);
        //         break;
        //     case 'private':
        //         private_chat(req, res);
        // }
        res.render('chat', {title: 'Chat Room | APP', url: req.headers.host, room: room, username: uname, privacy: privacy, invitation: invitation});
    } else if (!uname && room && invitation) {
        res.render('invites', {title: 'Hornet Invitees| APP', room: room, privacy: privacy});
    } else if(uname){
        res.render('chat', {title: 'Chat Room | APP', room: room, username: uname, privacy: undefined, invitation: undefined});
    }
});

module.exports = router;
