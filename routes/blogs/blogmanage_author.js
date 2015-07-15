var express = require('express');
var router = express.Router();

var protocol=require("../../models/protocols");
var protocolInfo=require("../../models/protocolDeclare");
var model=require("../../models/db");
var lock=require("../../models/lock");
var rangen=require("../../funchelper/rangen");
var stat=require("../../manage/statistics");
var puburl=require("../../configure/url");
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
    if (isnew)
    {
        var insList=["title","catalog","preview","order","author","tag","content"];
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

module.exports = router;
