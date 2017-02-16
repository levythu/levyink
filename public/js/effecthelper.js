var effect_helper=
{
    FONT_SERVER: "font.levy.at",
    colorlist:
    [
        "#E53935",
        "#D81B60",
        "#8E24AA",
        "#3F51B5",
        "#2196F3",
        "#009688",
        "#4CAF50",
        "#FFC107",
        "#FB8C00",
        "#FF5722",
        "#607D8B"
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
}
$(document).ready(function()
{
    if ($(".absCenter").length>0)
        $(window).resize(effectHelper_adj);
    setShortcut();
    $(".absCenter").load(function() {
        $(window).trigger("resize");
    });

    $(window).trigger("resize");
});

function fetchFont(url)
{
    if (url==undefined)
        url=window.location.href;
    j=document.createElement("script");
    j.src="https://"+effect_helper.FONT_SERVER+"/jspadding.js?addcss=1&font=stsong&url="+encodeURIComponent(url);
    document.body.appendChild(j);
}

// start with / and end with enter
function setShortcut() {
    var shortcutMap={};
    var expirationTimer=0;
    var nowTyping="";
    var hasStart=false;

    function expireType() {
        nowTyping="";
        hasStart=false;
        clearTimeout(expirationTimer);
    }
    function startType() {
        clearTimeout(expirationTimer);
        nowTyping="";
        hasStart=true;
        expirationTimer=setTimeout(expireType, 1000);
    }
    effect_helper.addShortcut=function(str, cb) {
        shortcutMap[str]=cb;
    }
    effect_helper.clearShortcut=function(str) {
        delete shortcutMap[str];
    }
    $("body").keyup(function(e) {
        var keyc=e.which;
        //console.log(hasStart, keyc);
        if (keyc==undefined && hasStart)
        {
            expireType();
            return;
        }
        if (keyc===191) {
            // enter mode
            startType();
            return;
        }
        if (!hasStart) {
            return;
        }

        if (keyc===13) {
            nowTyping=nowTyping.toLowerCase();
            console.log(nowTyping);
            if (nowTyping in shortcutMap)
            {
                setTimeout(shortcutMap[nowTyping], 0);
            }
            expireType();
            return;
        }
        nowTyping+=String.fromCharCode(keyc);
        clearTimeout(expirationTimer);
        expirationTimer=setTimeout(expireType, 1000);
    });

    effect_helper.addShortcut("login", function() {
        window.location="/login";
    });
    effect_helper.addShortcut("logout", function() {
        window.location="/logout";
    });
}
