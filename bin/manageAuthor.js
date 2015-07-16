var model=require("../models/db");
var db=model.db;

if (process.argv.length<4)
{
    console.log("FORMAT: node manageAuthor.js USERNAME PASSWORD");
    process.exit(-1);
}
var _usr=process.argv[2];
var _passwd=process.argv[3];

db[model.AUTHOR].update({name:_usr},{$set:{passwd:_passwd}},{upsert: true},
    function(err, res)
    {
        if (err || res.n==0)
        {
            console.log("Failed. Error:");
            console.log(err.stack || "Nothing affected");
            process.exit(-1);
        }
        console.log("Succeeded! Now that you could access account with");
        console.log("USERNAME: "+_usr);
        console.log("PASSWORD: "+_passwd);
        process.exit(0);
    });
