/**
 * Created by dragfire on 21-04-2016.
 */

var express = require('express');
var router = express.Router();
var schemas = require('../model/schemas');
var debug = require('debug')('NASH: Setup');

router.post('/', function (req, res) {
    var chats = [{
        created: new Date(),
        content: 'Hello World!',
        username: 'Chris',
        room: 'mean'
    }, {
        created: new Date(),
        content: 'Hello',
        username: 'Obinna',
        room: 'laravel'
    }, {
        created: new Date(),
        content: 'Ait',
        username: 'Bill',
        room: 'angular'
    }, {
        created: new Date(),
        content: 'Amazing room',
        username: 'Patience',
        room: 'socet.io'
    }];
    
    var newChat;
    
    chats.forEach(function (chat) {
        //debug(chat);
        newChat = new schemas.Chat(chat);
        newChat.save(function (err, chat) {
            debug('SAVED', chat);
        });
    });
    res.send("SAVED");
});

module.exports = router;