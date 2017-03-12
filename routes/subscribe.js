var express = require('express');
var router = express.Router();
var path = require('path');

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var model=require("../models/db");
var db=model.db;

var pubRoot={root: path.join(__dirname, '../public')};

router.get("/", function(req, res) {
    res.sendFile("subscribe.html", pubRoot);
});

module.exports = router;
