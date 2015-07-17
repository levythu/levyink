var effect_helper=
{
    FONT_SERVER: "font.levy.at",
    colorlist:
    [
        "rgb(255,185,0)",
        "rgb(216,59,1)",
        "rgb(232,17,35)",
        "rgb(227,0,140)",
        "rgb(180,0,158)",
        "rgb(92,0,92)",
        "rgb(92,45,145)",
        "rgb(0,120,215)",
        "rgb(0,130,114)",
        "rgb(0,75,80)",
        "rgb(16,124,16)",
        "rgb(0,75,28)"
    ],
    colorDispense:{},
    colorUsed:0
}

function dispenseColor(token)
{
    if (effect_helper.colorDispense[token]!=undefined) return effect_helper.colorDispense[token];
    if (effect_helper.colorUsed==effect_helper.colorlist.length) return (effect_helper.colorDispense[token]=effect_helper.colorlist[Math.floor(Math.random()*effect_helper.colorlist.length)]);
    var ch=Math.floor(Math.random()*(effect_helper.colorlist.length-effect_helper.colorUsed));
    var del=effect_helper.colorlist.splice(ch,1)[0];
    effect_helper.colorlist.push(del);
    effect_helper.colorUsed++;
    effect_helper.colorDispense[token]=del;
    return del;
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
function effectHelper_adj()
{
    $(".absCenter").each(function(id,dom)
    {
        $(dom).css("position","absolute")
              .css("left",(dom.parentNode.offsetWidth-dom.offsetWidth)*0.5)
              .css("top",(dom.parentNode.offsetHeight-dom.offsetHeight)*0.5);
    });
    $(".absCenter").each(function(id,dom)
    {
        $(dom).css("position","absolute")
              .css("left",(dom.parentNode.offsetWidth-dom.offsetWidth)*0.5)
              .css("top",(dom.parentNode.offsetHeight-dom.offsetHeight)*0.5);
    });

    $(".strongRes img").each(function(id,dom)
    {
        var pw=dom.parentNode;
        if (dom.offsetWidth>pw.offsetWidth)
        {
            if ($(dom).attr("lvori")==undefined)
            {
                $(dom).attr("lvres",dom.offsetHeight/dom.offsetWidth);
                $(dom).attr("lvori",dom.offsetWidth);
            }
            $(dom).css("width",pw.offsetWidth).css("height",$(dom).attr("lvres")*pw.offsetWidth);
        }
        else
        {
            if ($(dom).attr("lvori")!=undefined)
            {
                mwid=Math.min(pw.offsetWidth,-(-$(dom).attr("lvori")));

                $(dom).css("width",mwid).css("height",$(dom).attr("lvres")*mwid);
            }
        }
    });
}
$(document).ready(function()
{
    $(window).resize(effectHelper_adj);

    $(window).trigger("resize");
});

function fetchFont(url)
{
    if (url==undefined)
        url=window.location.href;
    j=document.createElement("script");
    j.src="http://"+effect_helper.FONT_SERVER+"/jspadding.js?addcss=1&font=stsong&url="+encodeURIComponent(url);
    document.body.appendChild(j);
}
