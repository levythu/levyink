var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var blogmanage=require("./blogs/blogmanage");
var tilemanage=require("./tiles/tile_nau").r;
var authmanage=require("./outauth/authtest");

router.use("/blog",blogmanage);
router.use("/tiles",tilemanage);
router.use("/auth",authmanage);

router.get('/', function(req, res, next)
{
    res.send("hello from nau!");
});

module.exports = router;
