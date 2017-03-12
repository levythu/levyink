var model=require("./db");
var protocolInfo=require("./protocolDeclare");
var fs=require("fs");
var db=model.db;

var content=JSON.parse(fs.readFileSync(process.argv[2], {encoding: "utf8"}));

var total=0;
for (var i in content) {
    total+=content[i].length;
}

var completed=0;
for (var i in content) {
    for (var j=0; j<content[i].length; j++) {
        db[i].insert(protocolInfo.ansisecure(content[i][j]), function(err) {
            if (err!=null) {
                console.log("With one error.");
            }
            completed++;
            console.log(completed+"/"+total);
        });
    }
}

setInterval(function() {
}, 1000);
