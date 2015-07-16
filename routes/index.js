var express = require('express');
var path = require('path');
var router = express.Router();

var r_blog = require("./blog");

var pubRoot={root: path.join(__dirname, '../public')};

/* GET home page. */
router.get('/', function(req, res)
{
    res.sendFile("blog.html",pubRoot);
});
router.use('/blog', r_blog);
router.get('/login', function(req, res)
{
    res.sendFile("login.html",pubRoot);
});
router.get('/me', function(req, res)
{
    res.sendFile("me.html",pubRoot);
});
router.get('/mess', function(req, res)
{
    res.sendFile("mess.html",pubRoot);
});
router.get('/editor', function(req, res)
{
    res.sendFile("editor.html",pubRoot);
});

module.exports = router;
