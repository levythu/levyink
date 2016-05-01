var tiles_admin={
    isInAdminMode: false,
    KEY_Q: 81,
    REMOVE_API: "https://www.levy.at/rest/authorized/tiles/remove"
};

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

    $(window).resize(me_admin_ui);

    document.onkeydown=keyboardHook;

    $(window).trigger("resize");
    setTimeout(function(){$(window).trigger("resize");},1000);
}
function toggleMode()
{
    if (tiles_admin.isInAdminMode)
    {
        $("#superButton").removeClass("adminSu");
        $(".elemTile:not(#editTile)").removeClass("hoverRed")
        tiles_admin.isInAdminMode=false;
    }
    else
    {
        tiles_admin.isInAdminMode=true;
        $(".elemTile:not(#editTile)").addClass("hoverRed").each(function(id, dom) {
            $(dom).unbind("click")
                  .click(function() {

                if (!tiles_admin.isInAdminMode)
                    return;
                var tid=dom.id.substr(commentsCanvas_js.PREFIX_TILE.length);
                if (!confirm("Confirm to remove?"))
                    return;
                $.post(tiles_admin.REMOVE_API, {
                    tid: tid
                }, function(data)
                {
                    var code=(JSON.parse(data)).status;
                    if (code<protocolInfo.LEAST_ERR)
                    {
                        commentsCanvas_js.removeTile(tid);
                    }
                    else
                    {
                        // nothing
                    }
                }).fail(function() {
                    // nothing
                });

                return false;

            });
        });
        $("#superButton").addClass("adminSu");
    }
}
function me_admin_ui()
{
    var uwidth=$(window).width();
    if (uwidth<700)
    {
        $("#superButton").css("right",(uwidth-$("#superButton")[0].offsetWidth)/2);
    }
    else
    {
        $("#superButton").css("right","5em");
    }
    effectHelper_adj();
}
function keyboardHook(e)
{
	var keyPressed=e.keyCode;
    switch (keyPressed)
	{
	case tiles_admin.KEY_Q:
		toggleMode();
        e.preventDefault();
		break;
    }
}
