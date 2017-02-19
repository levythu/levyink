var express = require('express');
var router = express.Router();

var protocol=require("../../models/protocols");
var protocolInfo=require("../../models/protocolDeclare");
var model=require("../../models/db");
var auth=require("../../manage/authencitation");
var puburl=require("../../configure/url");
var db=model.db;

var searchable=["catalog","author"];

function digestAll(req, res) {
    var searchCondition={};
    var us=req.session.author || "%IMPOSSIBLE%";

    db[model.AUTHOR].find(
    {
        name: us
    },function(err,docs) {
        if (err||docs.length==0)
        {
            searchCondition["order"]={$gt:-1};
        }
        if (searchable.indexOf(req.query.filter)>=0)
        {
            searchCondition[req.query.filter]=req.query.key;
        }
        db[model.BLOG].find(searchCondition,{content:0, preview:0})
            .sort({order:-1,pubtime:-1}).toArray(function(err, doc) {
            if (err) {
                res.send(JSON.stringify({
                    "status": protocolInfo.generalRes.statusCode.DB_ERROR,
                    "content": null
                }));
                return;
            }
            var artList=[];
            for (var i=0;i<doc.length;i++) {
                artList.push(protocolInfo.secure(
                {
                    title: doc[i].title,
                    catalog: doc[i].catalog,
                    pubtime: doc[i].pubtime,
                    pid: doc[i].pid,
                    order: doc[i].order,
                    url: puburl.blogpage.replace(/%PID%/g,doc[i].pid)
                }));
            }
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NORMAL,
                "content": [],
                "blog_in_total": artList.length,
                "digest_content": artList,
                "reserved": "[置顶][隐藏]"
            }));
            return;
        });
    });
}

router.get('/list', function(req, res)
{
    if (req.query.fetchstart==undefined || req.query.fetchcount==undefined || req.query.filter==undefined)
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "content": null
        }));
        return;
    }
    var fstart=(-(-req.query.fetchstart));
    var fcount=(-(-req.query.fetchcount));
    if (fstart<0) {
        // special logic: return a empty result but with all digest
        digestAll(req, res);
        return;
    }
    if (fstart==NaN || fcount==NaN || fstart<0 || fcount<0)
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "content": null
        }));
        return;
    }

    var searchCondition={};
    var us=req.session.author || "%IMPOSSIBLE%";

    db[model.AUTHOR].find(
    {
        name: us
    },function(err,docs)
    {
        if (err||docs.length==0)
        {
            searchCondition["order"]={$gt:-1};
        }
        if (searchable.indexOf(req.query.filter)>=0)
        {
            searchCondition[req.query.filter]=req.query.key;
        }
        db[model.BLOG].count(searchCondition,function(err, ct)
        {
            if (err)
            {
                res.send(JSON.stringify({
                    "status": protocolInfo.generalRes.statusCode.GET_LIST_FAIL,
                    "content": null
                }));
                return;
            }
            db[model.BLOG].find(searchCondition,{content:0}).limit(fcount).skip(fstart)
                .sort({order:-1,pubtime:-1}).toArray(function(err, doc)
            {
                if (err)
                {
                    res.send(JSON.stringify({
                        "status": protocolInfo.generalRes.statusCode.DB_ERROR,
                        "content": null
                    }));
                    return;
                }
                var artList=[];
                for (var i=0;i<doc.length;i++)
                {
                    artList.push(protocolInfo.secure(
                    {
                        title: doc[i].title,
                        catalog: doc[i].catalog,
                        pubtime: doc[i].pubtime,
                        preview: doc[i].preview,
                        commentcount: 0,
                        pid: doc[i].pid,
                        order: doc[i].order,
                        author: doc[i].author,
                        tag: doc[i].author,
                        url: puburl.blogpage.replace(/%PID%/g,doc[i].pid)
                    }));
                }
                res.send(JSON.stringify(
                {
                    "status": protocolInfo.generalRes.statusCode.NORMAL,
                    "content": artList,
                    "blog_in_total": ct,
                    "reserved": "[置顶][隐藏]"
                }));
                return;
            });
        });
    });

});

router.get('/passage', function(req, res)
{
    if (req.query.pid==undefined)
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "content": null
        }));
        return;
    }
    db[model.BLOG].find({pid:req.query.pid},{_id:0},function(err,doc)
    {
        if (err || doc.length==0)
        {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NO_SUCH_DOCS,
                "content": null
            }));
            return;
        }
        doc=doc[0];
        var procNext=function()
        {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NORMAL,
                "content": protocolInfo.secure(doc)
            }));
            return;
        }
        if (doc.order<0)
        {
            auth.validateAdmin(req,procNext,function()
            {
                res.send(JSON.stringify({
                    "status": protocolInfo.generalRes.statusCode.NO_SUCH_DOCS,
                    "content": null
                }));
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
