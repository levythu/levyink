exports.hostname="192.168.1.97:2333";

exports.blogpage="/blog/%PID%?toTop=1";

exports.genURL
=function(relURL)
{
    return "http://"+exports.hostname+relURL;
}
