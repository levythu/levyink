function refreshCaptcha() {
    $("#imgCaptcha").attr("src", "/subscribe/captcha?"+(new Date()).getTime());
}
