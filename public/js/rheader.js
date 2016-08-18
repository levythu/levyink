var blog_js=
{
    totop_hide_timer: 0
};

$(document).ready(function()
{
    $("body").dblclick(function(e)
    {
        clearTimeout(blog_js.totop_hide_timer);
        $("#toTop").css("top","0em");
        blog_js.totop_hide_timer=setTimeout(function()
        {
            $("#toTop").css("top","-4em");
        },3000);
    });
    if (true)
    {
        $("body").taphold(function()
        {
            clearTimeout(blog_js.totop_hide_timer);
            $("#toTop").css("top","0em");
            blog_js.totop_hide_timer=setTimeout(function()
            {
                $("#toTop").css("top","-4em");
            },3000);
        });
        $("#toTop").tap(function()
        {
            clearTimeout(blog_js.totop_hide_timer);
            $("#toTop").css("top","-4em");
            scroll2Top();
        });
    }
    $("#floatBack").tap(hideBlack);

    $(window).trigger("resize");
    $("html").load(function(){
        $(window).trigger("resize");
    });

    if (getParameterByName('toTop')!="")
        setTimeout(function(){scroll2Top()}, 500);
});
function scroll2Top(disableAnime)
{
    if (disableAnime===true)
        $("html, body").scrollTop($("#latitle")[0].offsetTop-60);
    else
        $("html, body").animate({scrollTop: $("#latitle")[0].offsetTop-60}, 400);
}

function showBlack()
{
    $("#floatBack").css("pointer-events","auto").css("opacity",1);
    $("#topInk").addClass("blur_5px");
    $("#followedFrame").addClass("blur_5px");
}
function hideBlack()
{
    $("#floatBack").css("pointer-events","none").css("opacity",0);
    $("#topInk").removeClass("blur_5px");
    $("#followedFrame").removeClass("blur_5px");
}
