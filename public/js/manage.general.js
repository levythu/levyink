var manage_general_js=
{
};

$(document).ready(function()
{
    $(window).resize(updateUI);
    $(".glyph-option").tap(function()
    {
        $(this).parent().children(".glyph-option").removeClass("glyph-option-chosen");
        $(this).addClass("glyph-option-chosen");
    });
    $(".exclusiveSelect").tap(function()
    {
        var that=this;
        $(this).parent().children(".exclusiveSelect").each(function(id,dom)
        {
            if (dom!==that)
                $(dom).removeClass("checkBox_white_chosen");
        });
    });
    $(".checkBox_white").tap(function()
    {
        var p=$(this);
        if (p.hasClass("checkBox_white_chosen"))
            p.removeClass("checkBox_white_chosen");
        else
            p.addClass("checkBox_white_chosen");
    });
    $("html").load(function(){$(window).trigger("resize");});
    setInterval(function(){$(window).trigger("resize");},2000);

    $(window).trigger("resize");
});

function updateUI()
{
    var wheight=$(window).height(),wwidth=$(window).width();
    $("#dBar").css("top",$("#topBar").css("height")).css("height",wheight-$("#topBar")[0].offsetHeight);
    if ($("#morgan")[0].offsetWidth+$("#tbglobal")[0].offsetWidth>=wwidth)
    {
        $("#morgan").addClass("nonexist-noblock");
    }
    else
    {
        $("#morgan").removeClass("nonexist-noblock");
    }
}
function showCover(showWord,isp)
{
    $("#promptWord").text(showWord);
    if (isp===false)
    {
        $("#loadingFrame_pic").addClass("nonexist");
    }
    else
    {
        $("#loadingFrame_pic").removeClass("nonexist");
    }
    $(window).trigger("resize");
    $("#upperCanvas").removeClass("nonexist");
}
function hideCover()
{
    $("#upperCanvas").addClass("nonexist");
}
