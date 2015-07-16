var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var model=require("../models/db");
var ency=require("../funchelper/encrypt");
var db=model.db;

exports.validateAdmin=
function(req,succ,fail)
{
    if (req.session.author==null)
    {
        fail();
        return;
    }
    db[model.AUTHOR].find(
    {
        name: req.session.author
    },function(err,docs)
    {
        if (err||docs.length==0)
        {
            fail();
            return;
        }
        succ();
    });
}

exports.getToken=
function()
{
    return Math.floor(((new Date()).getTime())/60/1000);
}

exports.checkAccount=
function(usr,pass,succ,fail)
{
    db[model.AUTHOR].find(
    {
        name: usr
    },function(err,docs)
    {
        if (err||docs.length==0)
        {
            fail();
            return;
        }
        var canps=docs[0].passwd;
        canps=ency.calculateHASH(canps+exports.getToken());
        if (pass===canps)
            succ();
        else
            fail();
    });
}
