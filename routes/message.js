var express = require('express');
var router = express.Router();
var schemas = require('../model/schemas');
var debug = require('debug')('NASH: ');

router.get('/', function (req, res) {
    schemas.Chat.find({
        'room': req.query.room.toLowerCase()
    }).exec(function (err, msgs) {
        res.json(msgs);
    });
});

module.exports = router;