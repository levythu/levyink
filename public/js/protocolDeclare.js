var protocolInfo=
{
    LEAST_ERR: 1000,
    generalRes:
    {
        statusCode:
        {
            NORMAL:0,

            UNAUTHORIZED:1000,
            INVALID_USER:1001,

            INVALID_PARAMETER: 2000,
            INVALID_POST_CONTENT: 2001,

            REDUNDANCY_POST: 3000,
            CREATION_FAIL: 3001,
            GET_LIST_FAIL: 3002,
            NO_SUCH_DOCS: 3003,
            UPDATE_FAIL: 3004,         

            DB_ERROR: 17000,

            FRONT_END_ERROR: 65535
        }
    }
};

protocolInfo.escape=
function(str)
{
    str=str.replace(/%/g,"%ESC-PERCENT%");
    str=str.replace(/\r\n/g,"%ESC-R-N%");
    str=str.replace(/\n/g,"%ESC-N%");
    str=str.replace(/\"/g,"%ESC-QUOTE%");
    str=str.replace(/\'/g,"%ESC-SINGLE_QUOTE%");
    return str;
};
protocolInfo.descape=
function(str)
{
    str=str.replace(/%ESC-SINGLE_QUOTE%/g,"\'");
    str=str.replace(/%ESC-QUOTE%/g,"\"");
    str=str.replace(/%ESC-N%/g,"\n");
    str=str.replace(/%ESC-R-N%/g,"\r\n");
    str=str.replace(/%ESC-PERCENT%/g,"%");
    return str;
};
protocolInfo.secure=
function(obj)
{
    for (var i in obj)
    {
        if (typeof obj[i]=="string")
            obj[i]=protocolInfo.escape(obj[i]);
        else if (obj[i] instanceof Array)
            for (var j=0;j<obj[i].length;j++)
                if (typeof obj[i][j]=="string")
                    obj[i][j]=protocolInfo.escape(obj[i][j]);
    }
    return obj;
}
protocolInfo.ansisecure=
function(obj)
{
    for (var i in obj)
    {
        if ((typeof obj[i])=="string")
            obj[i]=protocolInfo.descape(obj[i]);
        else if (obj[i] instanceof Array)
            for (var j=0;j<obj[i].length;j++)
                if (typeof obj[i][j]=="string")
                    obj[i][j]=protocolInfo.descape(obj[i][j]);
    }
    return obj;
}