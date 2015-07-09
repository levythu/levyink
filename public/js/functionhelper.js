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
    var t=(/\/[a-zA-Z_0-9.]*$/.exec(str));
    if (t==null) return;
    t=t[0];
    if (t.length>0)
        t=t.substr(1);
    return t;
}
