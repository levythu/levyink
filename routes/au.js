var express = require('express');
var router = express.Router();

var auth=require("../manage/authencitation");
var oa=require("./outauth/askforauth");

var pubRoot={root: path.join(__dirname, '../public')};

router.use('/', function(req, res, next)
{
    auth.validateAdmin(req, next, function()
    {
        res.sendFile("redirectToLogin.html", pubRoot);
        return;
    });
});

router.use("/auth", oa);

module.exports = router;
