var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var blogmanage=require("./blogmanage");

router.use("/blog",blogmanage);

module.exports = router;
