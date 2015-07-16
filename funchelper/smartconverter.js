exports.smartConvertfromString=
function(src,mimick)
{
    var tp=typeof mimick;
    if (tp=="number")
    {
        return -(0-src);
    }
    else if (tp=="boolean")
    {
        return (src=="true");
    }
    else if (tp=="string")
    {
        return src;
    }
}
