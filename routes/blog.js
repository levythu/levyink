var express = require('express');
var path = require('path');
var router = express.Router();

var model=require("../models/db");
var auth=require("../manage/authencitation");
var protocolInfo=require("../models/protocolDeclare");
var sta = require("../manage/statistics");
var db=model.db;

var sdmath = require("../public/js/showdown/mathjax");
var showdown  = require('showdown'),
    sdtable = require('showdown-table'),
    sdprett = require('showdown-prettify'),
    converter = new showdown.Converter(
    {
        tables: true,
        ghCodeBlocks: true,
        tasklists: true,
        noHeaderId: true,
        parseImgDimensions: true,
        extensions: [sdmath,sdtable,sdprett]
    });

var pubRoot={root: path.join(__dirname, '../public')}

router.get('/', function(req, res)
{
    sta.addTotalVisit();
    res.sendFile("blog.html",pubRoot);
});
router.use('/',express.static(path.join(__dirname, '../public')));

router.get(/^\/[0-9A-Za-z]*$/, function(req, res)
{
    sta.addTotalVisit();
    var tm=req.path.substr(1);
    db[model.BLOG].find({pid:tm},{_id:0},function(err,doc)
    {
        if (err || doc.length==0)
        {
            res.status(404).sendFile("w404.html",pubRoot);
            return;
        }
        doc=doc[0];
        con=doc.content;
        delete doc.content;
        var procNext=function()
        {
            sta.addBlogVisit(doc.pid);
            res.render("pdetail",
            {
                secureStr: JSON.stringify(protocolInfo.secure(doc)),
                blgTitle: doc.title,
                cont: converter.makeHtml(con).replace(/linenums/g,"line-nums")
            });
        }
        if (doc.order<0)
        {
            auth.validateAdmin(req,procNext,function()
            {
                res.status(404).sendFile("w404.html",pubRoot);
                return;
            });
        }
        else
        {
            procNext();
        }
    });
});

module.exports = router;
