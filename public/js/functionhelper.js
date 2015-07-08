function trimStringToNum(str)
{
    var t=(/^\d*/.exec(str))[0];
    if (t!=undefined)
        t=-(-t);
    return t;
}
