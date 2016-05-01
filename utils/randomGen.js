var charPool="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-+";

exports.GenerateRandomString=function(length) {
    var res="";
    for (var i=0; i<length; i++) {
        res+=charPool[Math.floor(Math.random()*charPool.length)];
    }
    return res;
}
