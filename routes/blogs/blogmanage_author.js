var express = require('express');
var router = express.Router();

var protocol=require("../../models/protocols");
var protocolInfo=require("../../models/protocolDeclare");
var model=require("../../models/db");
var db=model.db;


router.get('/', function(req, res)
{


});

module.exports = router;
