function refreshCaptcha() {
    $("#imgCaptcha").attr("src", "/subscribe/captcha?"+(new Date()).getTime());
    $("#capArea")[0].value="";
    $("#capArea")[0].focus();
}

$(function() {
    var emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var onTheWay=false;
    $("#submit").tap(function() {
        if (!emailRegex.test($("#emailArea")[0].value)) {
            $("#prompt").html("<span style='color:#f44336'>Please provide a valid email.</span>");
            return;
        }
        if (onTheWay) return;
        onTheWay=true;
        $("#prompt").html("<span style='color:#607d8b'>Waiting for the email to be sent...</span>");
        $.post("/subscribe/register", {
            email: $("#emailArea")[0].value,
            captcha: $("#capArea")[0].value,
            name: $("#nameArea")[0].value
        }, function(data) {
            var code=(JSON.parse(data)).status;
            if (code===protocolInfo.generalRes.statusCode.INVALID_CAPTCHA) {
                $("#prompt").html("<span style='color:#f44336'>Mismatched text.</span>");
                refreshCaptcha();
                return;
            }
            if (code===protocolInfo.generalRes.statusCode.ERROR_WHEN_SENDING_EMAIL) {
                $("#prompt").html("<span style='color:#f44336'>Fail to send mail to the address.</span>");
                refreshCaptcha();
                return;
            }

            if (code===protocolInfo.generalRes.statusCode.NORMAL)
                $("#prompt").html("<span style='color:#4caf50'>An email was sent to your mailbox, check it to validate your address.</span>");
            else {
                $("#prompt").html("<span style='color:#f44336'>Backend Error:"+code+".</span>");
                refreshCaptcha();
                return;
            }
        }).fail(function() {
            $("#prompt").html("<span style='color:#f44336'>Network error.</span>");
        }).always(function() {
            onTheWay=false;
        });
    });

    var prefixLen_manage=("/subscribe/manage/").length;
    $("#unsubscribe").tap(function() {
        if (onTheWay) return;
        onTheWay=true;
        $("#prompt").html("<span style='color:#607d8b'>Waiting for the server...</span>");
        $.post("/subscribe/stop", {
            token: window.location.pathname.substr(prefixLen_manage),
        }, function(data) {
            var code=(JSON.parse(data)).status;

            if (code===protocolInfo.generalRes.statusCode.NORMAL)
                $("#prompt").html("<span style='color:#4caf50'>You have unsubscribe the blog.</span>");
            else {
                $("#prompt").html("<span style='color:#f44336'>Backend Error:"+code+".</span>");
                return;
            }
        }).fail(function() {
            $("#prompt").html("<span style='color:#f44336'>Network error.</span>");
        }).always(function() {
            onTheWay=false;
        });
    });
})
