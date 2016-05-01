var blog_admin_js=
{
    isInAdminMode: false,
    KEY_Q: 81
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

    document.onkeydown=keyboardHook;

    setTimeout(me_admin_ui,200);
    setTimeout(me_admin_ui,3000);
}
function toggleMode()
{
    if (blog_admin_js.isInAdminMode)
    {
        blog_admin_js.isInAdminMode=false;
        $("#superButton").removeClass("adminSu");
    }
    else
    {
        blog_admin_js.isInAdminMode=true;
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
