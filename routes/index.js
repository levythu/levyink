var express = require('express');
var path = require('path');
var router = express.Router();

var r_blog = require("./blog");
var sta = require("../manage/statistics");
var url=require("../configure/url");
var model=require("../models/db");
var db=model.db;

var pubRoot={root: path.join(__dirname, '../public')};

/* GET home page. */
router.get('/', function(req, res)
{
    sta.addTotalVisit();
    res.sendFile("blog.html",pubRoot);
});
router.use('/blog', r_blog);
router.get('/login', function(req, res)
{
    sta.addTotalVisit();
    res.sendFile("login.html",pubRoot);
});
router.get('/logout', function(req, res)
{
    req.session.author=undefined;
    var r=req.get("Referer");
    if (r==undefined && r=="")
        res.redirect("/blog");
    else
        res.redirect(r);
});
router.get('/me', function(req, res)
{
    sta.addTotalVisit();
    if (req.query["lang"]==="en-us")
    {
        res.sendFile("me.en-us.html",pubRoot);
        return
    }
    res.sendFile("me.html",pubRoot);
});
router.get('/mess', function(req, res)
{
    sta.addTotalVisit();
    res.sendFile("mess.html",pubRoot);
});
router.get('/editor', function(req, res)
{
    sta.addTotalVisit();
    res.sendFile("editor.html",pubRoot);
});
router.get('/crawller', function(req, res)
{
    sta.addTotalVisit();
    ls=[url.genURL("/"),url.genURL("/me"),url.genURL("/blog"),url.genURL("/mess")];
    db[model.BLOG].find({order:{$gt:-1}},{_id:0,pid:1},function(err,docs)
    {
        if (err)
        {
            res.render("crawller", {urllist:ls});
            return;
        }
        docs.forEach(function(doc){ls.push(url.genURL(url.blogpage.replace(/%PID%/g,doc.pid)))});
        res.render("crawller", {urllist:ls});
    });
});

module.exports = router;
