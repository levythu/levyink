var protocol=require("../models/protocols");
var protocolInfo=require("../models/protocolDeclare");

var model=require("../models/db");
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
