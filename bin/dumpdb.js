var model=require("../models/db");
var protocolInfo=require("../models/protocolDeclare");
var db=model.db;
var cl=model.cList;

var finished=0;
var des={};

function gen(t)
{
    return function()
    {
        db[t].find({},function(err,docs)
        {
            if (err)
            {
                console.error("error when dumping "+t+":");
                console.error(err.stack);
                process.exit(-1);
            }
            for (var j=0;j<docs.length;j++)
            {
                docs[j]=protocolInfo.secure(docs[j]);
            }
            des[t]=docs;
            finished++;
            if (finished==cl.length)
            {
                console.log(JSON.stringify(des));
                process.exit(0);
            }
        });
    };
}
for (var i=0;i<cl.length;i++)
{
    gen(cl[i])();
}
