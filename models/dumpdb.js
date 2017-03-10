var model=require("./db");
var protocolInfo=require("./protocolDeclare");
var db=model.db;
var cl=model.cList;

function gen(callback) {
    var result={};
    var finished=0;
    for (var i=0;i<cl.length;i++) {
        db[cl[i]].find({},function(err,docs) {
            if (err) {
                callback(null);
                return;
            }
            for (var j=0;j<docs.length;j++) {
                docs[j]=protocolInfo.secure(docs[j]);
            }
            result[cl[i]]=docs;
            finished++;
            if (finished==cl.length) {
                callback(result);
                return;
            }
        });
    }
}

module.exports=gen;
