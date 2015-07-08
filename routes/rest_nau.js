var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

router.get('/', function(req, res, next)
{
    res.send("hello from nau!");
});

module.exports = router;
