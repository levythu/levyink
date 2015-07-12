var protocolInfo=
{
    LEAST_ERR: 1000,
    generalRes:
    {
        statusCode:
        {
            NORMAL:0,

            UNAUTHORIZED:1000,
            INVALID_USER:1001
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

module.exports=protocolInfo;
