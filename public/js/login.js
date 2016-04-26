$(document).ready(function()
{
    var goTapped=false;
    var tp=function()
    {
        if (goTapped) return;
        goTapped=true;
        $("#gogogo").addClass("bigButton-blue-dark").removeClass("bigButton-blue");
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
                        $(".white-card").css("opacity", "0");
                        setTimeout(function(){window.location=function_helper.url_blog},0);
                    }
                    else
                    {
                        $(".errorInfo").text("Encountered error: "+code);
                    }
                }).fail(function() {
                    $(".errorInfo").text("Connection error");
                }).always(function() {
                    goTapped=false;
                    $("#gogogo").addClass("bigButton-blue").removeClass("bigButton-blue-dark");
                });
        }).fail(function() {
            goTapped=false;
                $(".errorInfo").text("Connection error");
            $("#gogogo").addClass("bigButton-blue").removeClass("bigButton-blue-dark");
        });
    };
    $("body").keypress(function(e){
        if(e.keyCode==13)
            tp();
    });
    $("#gogogo").tap(tp);
});
