// Mounted to nau restful api

var express = require('express');
var url=require("url");
var router = express.Router();

var protocol=require("../../models/protocols");
var protocolInfo=require("../../models/protocolDeclare");

var storage=require("./authstorage");

router.get("/test", function(req, res) {
    if (req.query!=undefined && req.query.token!=undefined)
        if (storage.TestAuth(req.query.token)) {
            req.send("TRUE");
            return;
        }
    req.send("FALSE");
    return;
});

module.exports = router;
