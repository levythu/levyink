var protocolInfo=
{
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
    str.replace(/\r\n/g,"%ESC-R-N%");
    str.replace(/\n/g,"%ESC-N%");
    str.replace(/\"/g,"%ESC-QUOTE%");
    str.replace(/\'/g,"%ESC-SINGLE_QUOTE%");
};
protocolInfo.descape=
function(str)
{
    str.replace(/\%ESC-SINGLE_QUOTE\%/g,"\'");
    str.replace(/\%ESC-QUOTE\%/g,"\"");
    str.replace(/\%ESC-N\%/g,"\n");
    str.replace(/\%ESC-R-N\%/g,"\r\n");
};

module.exports=protocolInfo;
