var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var blogmanage=require("./blogs/blogmanage");
var tilemanage=require("./tiles/tile_nau").r;

router.use("/blog",blogmanage);
router.use("/tiles",tilemanage);

router.get('/', function(req, res, next)
{
    res.send("hello from nau!");
});

module.exports = router;
