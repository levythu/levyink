var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var bma=require("./blogs/blogmanage_author");

router.use("/blog",bma);

router.get('/', function(req, res, next)
{
    res.send("hello from au!");
});

module.exports = router;
