var express = require('express');
var router = express.Router();
var path = require('path');
var svgCaptcha = require('svg-captcha');

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");
var url=require("../configure/url")
var rand=require("../utils/randomGen")

var model=require("../models/db");
var db=model.db;

var pubRoot={root: path.join(__dirname, '../public')};

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(require("../configure/emailauth"));

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
    var name=req.body.name;
    if (req.body.captcha!==req.session.captcha) {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_CAPTCHA
        }));
        return;
    };
    var token=rand.GenerateUUID(10);
    transporter.sendMail({
        from: 'Notification <noreply@levy.at>',
        to: email,
        subject: "Subscription System - Levy's Ink: Please Validate Your Email",
        text: 'Hi,'+name+'\n     Please follow the following link to validate your email and start receiving updates: '
            +url.genURL("/subscribe/validate/"+token)+  "\n After validation, you can manage your subscription at "+
            url.genURL("/subscribe/manage/"+token)
    }, function(error, info) {
        if (error!=null) {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.ERROR_WHEN_SENDING_EMAIL
            }));
            console.log(error, info);
            return;
        }
        db[model.SUBS].insert({
            email: email,
            name: name,
            token: token,
            valid: 0
        }, function(err,rec) {
            if (err || rec.length==0) {
                res.send(JSON.stringify({
                    "status": protocolInfo.generalRes.statusCode.DB_ERROR
                }));
                return;
            }
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NORMAL
            }));
        });
    });
});

router.post('/stop', function (req, res) {
    var token=req.body.token;

    db[model.SUBS].update({token: token},
        {$set:{valid: -1}}, {}, function(err,result) {
            if (err || result.n==0) {
                res.send(JSON.stringify({
                    "status": protocolInfo.generalRes.statusCode.DB_ERROR
                }));
                return;
            }
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NORMAL
            }));
        }
    );
});

var prefixLen_validate=("/validate/").length;
router.get(/^\/validate\/.*$/, function(req, res) {
    var token=req.path.substr(prefixLen_validate);
    db[model.SUBS].update({token: token},
        {$set:{valid: 1}}, {}, function(err,result) {
            if (err || result.n==0) {
                res.render("template", {
                    title: "Oops!",
                    content: "The token you have provided seems invalid."
                });
                return;
            }
            res.redirect("/subscribe/manage/"+token);
        }
    );
});

var prefixLen_manage=("/manage/").length;
router.get(/^\/manage\/.*$/, function(req, res) {
    var token=req.path.substr(prefixLen_manage);
    db[model.SUBS].find({token: token, valid: 1}, function(err,docs) {
            if (err || docs.length==0) {
                res.render("template", {
                    title: "Oops!",
                    content: "The token you have provided seems invalid."
                });
                return;
            }
            res.render("subscribe_manage", {
                name: docs[0].name,
                email: docs[0].email
            });
        }
    );
});

module.exports = router;
