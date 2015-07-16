$(document).ready(function()
{
    $("#gogogo").tap(function()
    {
        $.get("/rest/user/token",function(data)
        {
            var shaObj = new jsSHA("SHA-1", "TEXT");
            shaObj.update($("#tpss")[0].value+data);
            var hash = shaObj.getHash("HEX");
            $.post("/rest/user/login",{user:$("#tusr")[0].value,passwd:hash},
                function(data)
                {
                    var code=(JSON.parse(data)).status;
                    if (code<protocolInfo.LEAST_ERR)
                    {
                        $(".errorInfo").text("");
                        $(".rightInfo").text("Good! Logged in.")
                        setTimeout(function(){window.location=function_helper.url_blog},3000);
                    }
                    else
                    {
                        $(".errorInfo").text("Encountered error: "+code);
                    }
                });
        });
    });
});
