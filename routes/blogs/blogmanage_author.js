var express = require('express');
var router = express.Router();

var protocol=require("../../models/protocols");
var protocolInfo=require("../../models/protocolDeclare");
var model=require("../../models/db");
var lock=require("../../models/lock");
var rangen=require("../../funchelper/rangen");
var stat=require("../../manage/statistics");
var puburl=require("../../configure/url");
var cvt=require("../../funchelper/smartconverter");
var db=model.db;

var redCheck={};

function verify(obj)
{
    if (typeof(obj.val)!="string")
        return false;
    try
    {
        obj=protocolInfo.ansisecure(JSON.parse(obj.val));
    }
    catch (e)
    {
        return false;
    }

    if (typeof(obj.title)!="string")
        return false;
    if (typeof(obj.catalog)!="string")
        return false;
    if (typeof(obj.preview)!="string")
        return false;
    if (typeof(obj.order)!="number")
        return false;
    if (typeof(obj.author)!="string")
        return false;
    if (!(obj.tag instanceof Array))
        return false;
    if (typeof(obj.reftime)!="boolean")
        return false;
    if (typeof(obj.token)!="string")
        return false;

    return obj;
}
function checkExist(tpid,yescall,nocall)
{
    db[model.BLOG].find({pid:tpid},function(err,docs)
    {
        if (err || docs.length==0)
        {
            nocall();
            return;
        }
        yescall();
    });
}
function checkInData(obj,isnew,callback)
{
    var insList=["title","catalog","preview","order","author","tag","content","img"];
    if (isnew)
    {
        lock.acquire("rest.blog.create.null",function()
        {
            stat.checkEssays(function(num)
            {
                if (num===false)
                {
                    lock.release("rest.blog.create.null");
                    callback(false);
                    return;
                }
                var toInsert={};
                for (var i=0;i<insList.length;i++)
                    if (insList[i] in obj)
                        toInsert[insList[i]]=obj[insList[i]];
                toInsert.pubtime=(new Date()).getTime();
                toInsert.pid=""+num;

                db[model.BLOG].insert(toInsert,function(err,doc)
                {
                    if (err || doc.length==0)
                    {
                        lock.release("rest.blog.create.null");
                        callback(false);
                        return;
                    }
                    stat.addEssay(function(result)
                    {
                        if (result===false)
                        {
                            lock.release("rest.blog.create.null");
                            callback(false);
                            return;
                        }
                        redCheck[obj.token]=true;
                        lock.release("rest.blog.create.null");
                        callback(num);
                    });
                });
            });
        });
    }
    else
    {
        lock.acquire("rest.blog.update."+obj.destination,function()
        {
            var toInsert={};
            for (var i=0;i<insList.length;i++)
                if (insList[i] in obj)
                    toInsert[insList[i]]=obj[insList[i]];
            if (obj.reftime===true)
                toInsert.pubtime=(new Date()).getTime();

            db[model.BLOG].update({pid:obj.destination},{$set:toInsert},{},
                function(err,rec)
                {
                    if (err || rec.length==0)
                    {
                        callback(false);
                        lock.release("rest.blog.update."+obj.destination);
                        return;
                    }
                    lock.release("rest.blog.update."+obj.destination);
                    callback(obj.destination);
                });
        });
    }
}
router.post('/create', function(req, res)
{
    var bdy=verify(req.body);
    if (bdy===false)
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_POST_CONTENT,
            "content": null
        }));
        return;
    }
    if (redCheck[bdy.token]!=undefined)
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.REDUNDANCY_POST,
            "content": null
        }));
        return;
    }

    checkInData(bdy,true,function(result)
    {
        if (result===false)
        {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.CREATION_FAIL,
                "content": null
            }));
            return;
        }
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.NORMAL,
            "content": protocolInfo.secure({url:puburl.blogpage.replace(/%PID%/g,result)})
        }));
    });
});
router.post('/update', function(req, res)
{
    if (req.query.pid==undefined || req.query.pid=="")
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "content": null
        }));
        return;
    }
    var bdy=verify(req.body);
    if (bdy===false)
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_POST_CONTENT,
            "content": null
        }));
        return;
    }
    bdy.destination=req.query.pid;

    checkInData(bdy,false,function(result)
    {
        if (result===false)
        {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.UPDATE_FAIL,
                "content": null
            }));
            return;
        }
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.NORMAL,
            "content": protocolInfo.secure({url:puburl.blogpage.replace(/%PID%/g,result)})
        }));
    });
});
router.get('/modify', function(req, res)
{
    if (req.query.pid==undefined || req.query.pid=="")
    {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "content": null
        }));
        return;
    }
    var providedField=
    {
        order: 1
    }
    upd={};
    var reqInfo=req.query;
    for (var i in reqInfo)
    {
        if (providedField[i]!=undefined)
        {
            upd[i]=cvt.smartConvertfromString(reqInfo[i],providedField[i]);
        }
    }
    db[model.BLOG].update({pid:req.query.pid},{$set:upd},{},
        function(err,rec)
        {
            if (err || rec.length==0)
            {
                res.send(JSON.stringify({
                    "status": protocolInfo.generalRes.statusCode.NO_SUCH_DOCS,
                    "content": null
                }));
                return;
            }
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NORMAL,
                "content": null
            }));
        }
    );
});

module.exports = router;
