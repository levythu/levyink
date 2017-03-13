var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var bma=require("./blogs/blogmanage_author");
var ta=require("./tiles/tile_au");
var dbdump=require("../models/dumpdb");

var mailNotify=require("./subscribe").onNotify;

router.use("/blog",bma);
router.use("/tiles",ta);

router.get('/', function(req, res, next)
{
    res.send("hello from au!");
});

router.get('/db.json', function(req, res)
{
    dbdump(function(obj) {
        if (obj==null) res.send("Error in dump.");
        else res.json(obj);
    });
});

router.post("/broadcast", mailNotify);

module.exports = router;
