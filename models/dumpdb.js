var model=require("./db");
var protocolInfo=require("./protocolDeclare");
var db=model.db;
var cl=model.cList;

function gen(callback) {
    var result={};
    var finished=0;
    for (var i=0;i<cl.length;i++) {
        (function(cname) {
            db[cname].find({},function(err,docs) {
                if (err) {
                    callback(null);
                    return;
                }
                for (var j=0;j<docs.length;j++) {
                    docs[j]=protocolInfo.secure(docs[j]);
                }
                result[cname]=docs;
                finished++;
                if (finished==cl.length) {
                    callback(result);
                    return;
                }
            });
        }) (cl[i]);
    }
}

module.exports=gen;
