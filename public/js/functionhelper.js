var function_helper=
{
    url_blog: "/blog",
    url_editor: "/editor",
    url_me: "/me",
    url_mess: "/mess",
    hostname: "59.66.137.81:2333",

    RANDOM_PATTERN_ALPHABET:"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    RANDOM_PATTERN_NUM:"0123456789",
    RANDOM_PATTERN_HEX:"1234567890ABCDEF"
}

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
    while (str[str.length-1]=="/")
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
function genRandom(pattern,len)
{
    var res="";
    for (var i=0;i<len;i++)
        res+=pattern[Math.floor(Math.random()*pattern.length)];
    return res;
}
function formatDate(ms)
{
    var t=new Date(ms);
    return ""+t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes();
}
function formatContent(str)
{
    return str;
}
