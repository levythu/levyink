var express = require('express');
var router = express.Router();

var auth=require("../manage/authencitation");
var oa=require("./outauth/askforauth");

router.use('/', function(req, res, next)
{
    auth.validateAdmin(req, next, function()
    {
        res.redirect("/login");
        return;
    });
});

router.use("/auth", oa);

module.exports = router;
