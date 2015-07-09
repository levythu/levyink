var blog_js={};

$(document).ready(function()
{
    $("#topInk").css("width","1366px");
    blog_js.titleTrigger1=
        $("#latitle")[0].offsetLeft+$("#bigtitle")[0].offsetLeft+$("#bigtitle")[0].offsetWidth
        +trimStringToNum($("#direct-panel").css("width"))
        +trimStringToNum($("#direct-panel").css("right"));
    blog_js.latitle_normal=trimStringToNum($("#latitle").css("bottom"));
    blog_js.latitle_elevated=blog_js.latitle_normal+$("#direct-panel")[0].offsetHeight+20;
    blog_js.bigtitle=trimStringToNum($("#bigtitle").css("font-size"));
    blog_js.smalltitle=trimStringToNum($("#smalltitle").css("font-size"));
    $("#topInk").css("width","100%");

    $(window).resize(updateLayout);
    $("body").doubletap(function(){scroll2Top()});
    bindDirectEvent();

    updateLayout();

    if (getParameterByName('toTop')!="")
        setTimeout(function(){scroll2Top()}, 500);;
});

function updateLayout()
{
    topInk_onResize();
}
function topInk_onResize()
{
    var topInkH2W=1008/3072;
    var contentWidth=$("#topInk")[0].offsetWidth;
    if ($(window).width()<320)
    {
        $("#topInk").css("width",320);
        contentWidth=320;
    }
    else
    {
        $("#topInk").css("width","100%");
    }

    if ($("#topInk")[0].offsetWidth>=blog_js.titleTrigger1)
    {
        $("#giPic").css("width","100%");
        $("#latitle").css("bottom",blog_js.latitle_normal)
                     .css("text-align","left");
        $("#direct-panel").css("right","20px");
    }
    else
    {
        $("#direct-panel").css("right",(contentWidth-$("#direct-panel")[0].offsetWidth)/2);
        contentWidth=blog_js.titleTrigger1;
        $("#giPic").css("width",contentWidth);
        $("#latitle").css("bottom",blog_js.latitle_elevated)
                     .css("text-align","center");
    }
    $("#topInk").css("height",contentWidth*topInkH2W);
    $("#followedFrame").css("top",contentWidth*topInkH2W);

    {
        var isShrink=false;
        var fontsize=trimStringToNum($("#bigtitle").css("font-size"));
        while ($("#bigtitle")[0].offsetWidth>$("#latitle")[0].offsetWidth)
        {
            isShrink=true;
            fontsize--;
            $("#bigtitle").css("font-size",fontsize);
            $("#smalltitle").css("font-size",0);
        }
        if (!isShrink)
        {
            while (fontsize<blog_js["bigtitle"] && $("#bigtitle")[0].offsetWidth<$("#latitle")[0].offsetWidth)
            {
                fontsize++;
                $("#bigtitle").css("font-size",fontsize);
                if (fontsize==blog_js["bigtitle"] && $("#bigtitle")[0])
                    $("#smalltitle").css("font-size",blog_js.smalltitle);
            }
        }
    }
}
function scroll2Top(disableAnime)
{
    if (disableAnime===true)
        $("html, body").scrollTop($("#latitle")[0].offsetTop-60);
    else
        $("html, body").animate({scrollTop: $("#latitle")[0].offsetTop-60}, 400);
}
function bindDirectEvent()
{
    var ls=["tab_me","tab_blog","tab_mess"];
    var loc=["me.html","blog.html","mess.html"];
    for (var i=0;i<ls.length;i++)
    {
        (function(nm,lc){
            $("#"+nm).tap(function()
            {
                alert(getLatestPath(window.location.href)+"\n"+lc);
                if (lc!=getLatestPath(window.location.href))
                    window.location.href=lc+"?toTop=1";
                else
                    scroll2Top();
            });
        })(ls[i],loc[i]);
    }

}
