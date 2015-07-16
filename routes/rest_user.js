var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");
var auth=require("../manage/authencitation");

var model=require("../models/db");
var db=model.db;

router.post("/login",function(req, res)
{
    if (req.body.user==undefined || req.body.passwd==undefined)
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_POST_CONTENT,
            "content": null
        }));
        return;
    }
    auth.checkAccount(req.body.user,req.body.passwd,
    function()
    {
        req.session.author=req.body.user;
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.NORMAL,
            "content": null
        }));
        return;
    },function()
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INCORRECT_USER_PASSWD,
            "content": null
        }));
        return;
    });
});
router.get("/token",function(req,res)
{
    res.send(""+auth.getToken());
});
router.get("/logout",function(req, res)
{
    req.session.author=undefined;
    res.send(JSON.stringify({
        "status": protocolInfo.generalRes.statusCode.NORMAL,
        "content": null
    }));
});

module.exports = router;
