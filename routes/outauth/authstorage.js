var random=require("../../utils/randomGen");
var Exmap=require("../../utils/expireMap");

var tmpStorage=new Exmap(10000, 10000);

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
