var random=require("../../utils/randomGen");
var Exmap=require("../../utils/expireMap");

var tmpStorage=new Exmap(30*1000, 60*1000);

// Return: token [string]; "" if fail;
exports.CreateAuth=function(token) {
    if (token==undefined) {
        token=random.GenerateRandomString(50);
    }

    tmpStorage.Set(token, true);
    return token;
}

exports.TestAuth=function(token) {
    return tmpStorage.Has(token);
}
