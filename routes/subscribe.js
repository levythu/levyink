var express = require('express');
var router = express.Router();
var path = require('path');
var svgCaptcha = require('svg-captcha');

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var model=require("../models/db");
var db=model.db;

var pubRoot={root: path.join(__dirname, '../public')};

router.get("/", function(req, res) {
    res.sendFile("subscribe.html", pubRoot);
});

router.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

router.post('/register', function (req, res) {
    var email=req.body.email;
    if (req.body.captcha!==req.session.captcha) {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_CAPTCHA
        }));
        return;
    };
    res.send(JSON.stringify({
        "status": protocolInfo.generalRes.statusCode.NORMAL
    }));
});

module.exports = router;
