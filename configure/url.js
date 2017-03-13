exports.hostname="levy.at";

exports.blogpage="/blog/%PID%?toTop=1";

exports.genURL
=function(relURL)
{
    return "https://"+exports.hostname+relURL;
}
