// Mounted to au restful api

var express = require('express');
var url=require("url");
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var storage=require("./authstorage");

router.get("/ask", function(req, res) {
    var token=storage.CreateAuth();
    if (token!="") {
        try {
            var des=url.parse(req.body.destination);
            if (des.search==undefined) des.search="?token="+token;
            else des.search+="&token="+token;
            req.redirect(url.format(des));
        } catch (e) {
            req.send("TOKEN CEARATION FAULT.");
        }
    } else {
        req.send("TOKEN CEARATION FAULT.");
    }
});

module.exports = router;
