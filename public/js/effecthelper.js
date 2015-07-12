var effect_helper=
{
    FONT_SERVER: "font.levys.ink"
}

function action2Location()
{
    $(".action2Location").tap(function()
    {
        if ($(this).attr("lvnewpage")==undefined)
            window.location=$(this).attr("lvaction");
        else
            window.open($(this).attr("lvaction"));
    });
}
/*
$(document).ready(function()
{
    j=document.createElement("script");
    j.src="http://"+effect_helper.FONT_SERVER+"/jspadding.js?addcss=1&font=stsong&url="+encodeURI(window.location.href);
    document.body.appendChild(j);
});
*/
