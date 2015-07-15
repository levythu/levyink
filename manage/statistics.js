var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");
var model=require("../models/db");
var lock=require("../models/lock");
var db=model.db;

exports.initSta=
function(callback)
{
    lock.acquire("statistics.init",function()
    {
        db[model.METADATA].insert(
        {
            type: "overview",
            essaynums: 0,
            messnums: 0
        },function(err,rec)
        {
            if (err || rec.length==0)
            {
                callback(false);
                lock.release("statistics.init");
                return;
            }
            //Yes! no release.
            callback();
        });
    });
}

exports.addEssay=
function(callback)
{
    db[model.METADATA].update(
        {type: "overview"},
        {$inc: {essaynums:1}},
        {multi:true},function(err,result)
        {
            if (err || result.n==0)
            {
                callback(false);
                return;
            }
            callback();
        });
}
exports.checkEssays=
function(callback)
{
    db[model.METADATA].find({type:"overview"},function(err,docs)
    {
        if (err || docs.length==0)
        {
            exports.initSta(function(res)
            {
                if (res===false)
                    callback(false);
                else
                    callback(0);
            });
        }
        else
        {
            callback(docs[0].essaynums);
        }
    });
}
