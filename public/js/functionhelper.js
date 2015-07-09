function trimStringToNum(str)
{
    var t=(/^\d*/.exec(str));
    if (t==null) return;
    t=t[0];
    if (t!=undefined)
        t=-(-t);
    return t;
}
function getLatestPath(str)
{
    while (str.endsWith("/"))
        str=str.substr(0,str.length-1);
    var t=(/(\/[a-zA-Z_0-9.]*$|\/[a-zA-Z_0-9.]*\?)/.exec(str));
    if (t==null) return;
    t=t[0];
    if (t.length>0)
        t=t.substr(1);
    if (t[t.length-1]=="?")
        t=t.substr(0,t.length-1);
    return t;
}
function getParameterByName(name)
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
