var blog_admin_js=
{
    isInAdminMode: false,
    KEY_Q: 81,
    KEY_R: 82,
    modified: false,

    API_MOD:"/rest/authorized/blog/modify"
}

$(document).ready(newComer);
function newComer()
{
    $("head").append($("<link href='css/blog.admin.css' rel='stylesheet' type='text/css'>"));
    $("#topInk").prepend(
        $("<div id='superButton' class='transit_all'>").html
        (
            '<span class="icon-flag mid-4-2-glyph"></span>'
        ).tap(toggleMode).taphold(function(){
            if (!confirm("Sure to log out?"))
                return;
            window.location="/logout";
        })
    );
    $("#errorFrame").after($('<div class="addFrame transit_all" class="transit_in_size">')
        .html('<span class="addFrame_c">+</span>')
    );

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
                if ($(this).hasClass("icon-eye"))
                {
                    $.get(blog_admin_js.API_MOD+"?order=-1&pid="+contxt.pid,function(data)
                    {
                        var res=JSON.parse(data);
                        if (res.status<protocolInfo.LEAST_ERR)
                        {
                            tnode.find(".tem_hide").removeClass("icon-eye").addClass("icon-eye-blocked");
                            tnode.find(".tem_pushpin").removeClass("glybutton_chosen");
                            showRef();
                        }
                    });
                }
                else
                {
                    $.get(blog_admin_js.API_MOD+"?order=0&pid="+contxt.pid,function(data)
                    {
                        var res=JSON.parse(data);
                        if (res.status<protocolInfo.LEAST_ERR)
                        {
                            tnode.find(".tem_hide").removeClass("icon-eye-blocked").addClass("icon-eye");
                            tnode.find(".tem_pushpin").removeClass("glybutton_chosen");
                            showRef();
                        }
                    });
                }
            });
            tnode.find(".tem_pushpin").tap(function()
            {
                if ($(this).hasClass("glybutton_chosen"))
                {
                    $.get(blog_admin_js.API_MOD+"?order=0&pid="+contxt.pid,function(data)
                    {
                        var res=JSON.parse(data);
                        if (res.status<protocolInfo.LEAST_ERR)
                        {
                            tnode.find(".tem_hide").removeClass("icon-eye-blocked").addClass("icon-eye");
                            tnode.find(".tem_pushpin").removeClass("glybutton_chosen");
                            showRef();
                        }
                    });
                }
                else
                {
                    $.get(blog_admin_js.API_MOD+"?order=10&pid="+contxt.pid,function(data)
                    {
                        var res=JSON.parse(data);
                        if (res.status<protocolInfo.LEAST_ERR)
                        {
                            tnode.find(".tem_hide").removeClass("icon-eye-blocked").addClass("icon-eye");
                            tnode.find(".tem_pushpin").addClass("glybutton_chosen");
                            showRef();
                        }
                    });
                }
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

    return false;
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
	case blog_admin_js.KEY_R:
		$("#refbut").trigger("tap");
        e.preventDefault();
		break;
    }
}
