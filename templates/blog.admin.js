var blog_admin_js=
{
    isInAdminMode: false,
    KEY_Q: 81,
    modified: false
}

$(document).ready(newComer);
function newComer()
{
    $("head").append($("<link href='css/blog.admin.css' rel='stylesheet' type='text/css'>"));
    $("#topInk").prepend(
        $("<div id='superButton' class='transit_all'>").html
        (
            '<span class="icon-flag mid-4-2-glyph"></span>'
        ).tap(toggleMode)
    );
    $("#errorFrame").after($('<div class="addFrame transit_all" class="transit_in_size">')
        .html('<span class="addFrame_c">+</span>')
    );

    $(window).resize(me_admin_ui);
    $("body").bind({finishAjaxBlog:function()
    {
        $("#blogboard .tem_man").each(function(id,dom)
        {
            var tnode=$(dom);
            var contxt=blog_js.search_Res[id];
            if (contxt.order<0)
                tnode.find(".tem_hide").removeClass("icon-eye").addClass("icon-eye-blocked");

            if (contxt.order==10)
                tnode.find(".tem_pushpin").addClass("glybutton_chosen");

            tnode.find(".tem_hide").tap(function()
            {
                showRef();
                //TODO
            });
            tnode.find(".tem_pushpin").tap(function()
            {
                showRef();
                //TODO
            });
            tnode.find(".tem_edit").tap(function()
            {
                window.location=function_helper.url_editor+"?pid="+contxt.pid;
            });
        });
        $(".addFrame").tap(function()
        {
            window.location=function_helper.url_editor;
        });
        blog_admin_js.modified=false;
        if (blog_admin_js.isInAdminMode) toggleMode();
    }});
    document.onkeydown=keyboardHook;

    $(window).trigger("resize");
    setTimeout(function(){$(window).trigger("resize");},1000);
}
function toggleMode()
{
    if (blog_admin_js.isInAdminMode)
    {
        $("#superButton").removeClass("adminSu");
        $(".addFrame").css("height","0em").css("opacity","0");
        $(".whtCanvas").addClass("nonexist").removeClass("dashBorder");
        $(".tem_idf").removeClass("blur_5px");
        blog_admin_js.isInAdminMode=false;
    }
    else
    {
        blog_admin_js.isInAdminMode=true;
        $(".addFrame").css("height","3em").css("opacity","1");
        $(".whtCanvas").removeClass("nonexist").addClass("dashBorder");
        $(".tem_idf").addClass("blur_5px");
        $("#superButton").addClass("adminSu");
    }
}
function keyboardHook(e)
{
	var keyPressed=e.keyCode;
    switch (keyPressed)
	{
	case blog_admin_js.KEY_Q:
		toggleMode();
        e.preventDefault();
		break;
    }
}
function me_admin_ui()
{
    var uwidth=$(window).width();
    if (uwidth<700)
    {
        $(".strechWidth").css("display", "inline-block");
        $("#superButton").css("right",(uwidth-$("#superButton")[0].offsetWidth)/2);
    }
    else
    {
        $(".strechWidth").css("display", "inline-flex");
        $("#superButton").css("right","5em");
    }
    effectHelper_adj();
}
