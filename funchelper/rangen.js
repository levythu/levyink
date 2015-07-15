exports.RANDOM_PATTERN_ALPHABET="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
exports.RANDOM_PATTERN_NUM="0123456789";
exports.RANDOM_PATTERN_HEX="1234567890ABCDEF";

exports.genRandom=
function(pattern,len)
{
    var res="";
    for (var i=0;i<len;i++)
        res+=pattern[Math.floor(Math.random()*pattern.length)];
    return res;
}
