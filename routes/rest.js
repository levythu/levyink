var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var model=require("../models/db");
var db=model.db;

var r_au=require("./rest_au");
var r_nau=require("./rest_nau");

router.get("/login",function(req, res)
{
    req.session.author="levy";
    res.send("Logined.")
});
router.get("/logout",function(req, res)
{
    req.session.author=undefined;
    res.send("Logouted.")
});
router.use('/authorized', function(req, res, next)
{
    if (req.session.author==null)
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.UNAUTHORIZED,
            "content": null
        }));
        return;
    }
    next();
});
router.use('/authorized', function(req, res, next)
{
    db[model.AUTHOR].find(
    {
        name: req.session.author
    },function(err,docs)
    {
        if (err||docs.length==0)
        {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.INVALID_USER,
                "content": null
            }));
            return;
        }
        next();
    });
});
router.use('/authorized', r_au);

router.use('/nonauthorized', r_nau);

module.exports = router;
