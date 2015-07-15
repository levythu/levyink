var express = require('express');
var path = require('path');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");
var auth=require("../manage/authencitation");

var model=require("../models/db");
var db=model.db;

var r_au=require("./rest_au");
var r_nau=require("./rest_nau");

var templateRoot={root: path.join(__dirname, '../templates')}

router.get('/blogadmin.js', function(req, res)
{
    auth.validateAdmin(req,function()
    {
        res.sendFile("blog.admin.js",templateRoot);
    },function()
    {
        res.sendFile("blog.admin.fake.js",templateRoot);
    });
});

module.exports = router;
