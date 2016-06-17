var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var bma=require("./blogs/blogmanage_author");
var ta=require("./tiles/tile_au");
var oa=require("./outauth/askforauth");

router.use("/blog",bma);
router.use("/tiles",ta);
router.use("/auth", oa);

router.get('/', function(req, res, next)
{
    res.send("hello from au!");
});

module.exports = router;
