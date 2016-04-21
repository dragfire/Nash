var express = require('express');
var router = express.Router();
var schemas = require('../model/schemas');
var debug = require('debug')('NASH: Chat');

router.get('/', function (req, res) {
    debug(req.query.username);
    var uname = req.query.username;
    res.render('chat', {title: 'Chat Room', username: uname});
});

module.exports = router;