exports.hostname="levy.at";

exports.blogpage="/blog/%PID%";

var hnWithSchema="https://"+exports.hostname;
exports.genURL
=function(relURL)
{
    return hnWithSchema+relURL;
}

exports.genURL2=function(relURL) {
    return relURL.replace(/\$FULLURL\$/g, hnWithSchema);
}
