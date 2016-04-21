var express = require('express');
var router = express.Router();
var schemas = require('../model/schemas');
var debug = require('debug')('NASH: Chat');

router.get('/', function (req, res) {
    debug(req.query);
    res.render('chat', {title: 'Chat Room',username: req.query.username});
});

module.exports = router;