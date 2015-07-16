var express = require('express');
var router = express.Router();

var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");
var auth=require("../manage/authencitation");

var model=require("../models/db");
var db=model.db;

var r_au=require("./rest_au");
var r_nau=require("./rest_nau");
var r_user=require("./rest_user");

router.use("/user",r_user);

router.use('/authorized', function(req, res, next)
{
    auth.validateAdmin(req,next,function()
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.UNAUTHORIZED,
            "content": null
        }));
        return;
    });
});
router.use('/authorized', r_au);

router.use('/nonauthorized', r_nau);

module.exports = router;
