var editor_js=
{
    isTwoView: true,
    docName: "",
    mdconverter: new showdown.Converter(
    {
        tables: true,
        ghCodeBlocks: true,
        tasklists: true,
        noHeaderId: true,
        parseImgDimensions: true,
        extensions: ['table','prettify']
    }),
    mdconverter_abs: new showdown.Converter(
    {
        tables: true,
        ghCodeBlocks: true,
        tasklists: true,
        noHeaderId: true,
        parseImgDimensions: true,
        extensions: ['table','prettify'],
        headerLevelStart: 3
    }),

    abstract:"",
    abstract_length:200,
    API_INFO:"/rest/authorized/blog/create",
    API_INFO2:"/rest/authorized/blog/update",
    API_GET:"/rest/nonauthorized/blog/passage",

    tmpToken:"",
    saved:false,

    toBroadcast:false
};

$(document).ready(function()
{
    editor_js.docName=getParameterByName("pid");
    editor_js.tmpToken=genRandom(function_helper.RANDOM_PATTERN_ALPHABET,30);

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
    $("#opt_edit").tap(function()
    {
        $("#profileArea").addClass("nonexist");
        $("#sourceCon").removeClass("nonexist");
    });
    $("#opt_prof").tap(function()
    {
        fillProfile();
        $("#profileArea").removeClass("nonexist");
    });
    $("#opt_prev").tap(function()
    {
        $("#profileArea").addClass("nonexist");
        if (editor_js.isTwoView)
            $("#sourceCon").removeClass("nonexist");
        else
            $("#sourceCon").addClass("nonexist");
    });
    $('#sourceTA').bind('input propertychange',renderMD).scroll(function()
    {
        $("#previewArea").scrollTop(
            $("#previewArea")[0].scrollHeight*$("#sourceTA").scrollTop()/$("#sourceTA")[0].scrollHeight
        );
    });
    enableTab('sourceTA');
    $("#saveBut").tap(function()
    {
        postIt(function(url, postBody)
        {
            if (editor_js.docName==="")
            {
                $("#sourceTA")[0].value="";
                backupContent();
            }
            editor_js.saved=true;
            if (editor_js.toBroadcast && postBody.order>=0)
                broadcast("Blog Update", "There's something new posted or updated in the blog:\n\n"+
                    "\t> "+postBody.title+":\t$FULLURL$"+url
                );
            showCover("Post success!",false);
            setTimeout(function()
            {
                window.location=url;
            },2000);
        });
    });
    $("html").load(function(){$(window).trigger("resize");});
    setInterval(function(){$(window).trigger("resize");},2000);

    $(window).trigger("resize");
    loadData();
    if (editor_js.docName==="")
    {
        setInterval(backupContent,10000);
        $(window).bind("beforeunload", backupContent);
    }
    else
    {
        $(window).bind("beforeunload", function()
        {
            if (editor_js.saved==false)
                return "Are you sure to quit? All the progress will get lost.";

        });
    }
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
    if (wwidth>850)
    {
        if (!editor_js.isTwoView)
        {
            editor_js.isTwoView=true;
            $(".unifiedInch").css("width","48.5%");
            $(".glyph-option-chosen").trigger("tap");
        }
    }
    else
    {
        if (editor_js.isTwoView)
        {
            editor_js.isTwoView=false;
            $(".unifiedInch").css("width","100%");
            $(".glyph-option-chosen").trigger("tap");
        }
    }
}

function renderMD()
{
    $("#preViewCont").html(editor_js.mdconverter.makeHtml($("#sourceTA")[0].value).replace(/linenums/g,"line-nums"));
    prettyPrint();
}
function backupContent()
{
    localStorage.setItem("localback",$("#sourceTA")[0].value);
}
function restoreContent()
{
    if (localStorage.getItem("localback")==undefined) return;
    $("#sourceTA")[0].value=localStorage.getItem("localback");
    renderMD();
}

function loadData()
{
    if (editor_js.docName==="")
    {
        restoreContent();
        hideCover();
        return;
    }
    else
    {
        $.get(editor_js.API_GET+"?pid="+editor_js.docName,function(data)
        {
            var rs;
            try
            {
                rs=JSON.parse(data);
            }
            catch (e)
            {
                showCover("Uh... There are fatal problems when fetching data, so editor cannot open. Sorry. CODE="
                    +protocolInfo.generalRes.statusCode.FRONT_END_ERROR,false);
            }
            if (rs.status>=protocolInfo.LEAST_ERR)
            {
                showCover("Uh... There are fatal problems when fetching data, so editor cannot open. Sorry. CODE="
                    +rs.status,false);
            }
            var cont=protocolInfo.ansisecure(rs.content);
            $("#ptitle")[0].value=cont.title;
            $("#pcata")[0].value=cont.catalog;
            if (cont.order==-1)
            {
                $("#phide").addClass("checkBox_white_chosen");
            }
            else if (cont.order==10)
            {
                $("#ptop").addClass("checkBox_white_chosen");
            }
            $("#pau")[0].value=cont.author;
            $("#ptag")[0].value=cont.tag.join(" ");
            if (cont.img!=undefined)
                $("#pimg")[0].value=cont.img;
            $("#sourceTA")[0].value=cont.content;
            renderMD();
            hideCover();
        });
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

function enableTab(id)
{
    var el = document.getElementById(id);
    el.onkeydown = function(e)
    {
        if (e.keyCode === 9)
        {
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;
            if ((start===0 || val[start-1]=="\n") && (end==val.length || val[end]=="\n" || val[end]=="\r"))
            {
                var tp=val.substring(start,end);
                this.value=val.substring(0, start)+tp.replace(/(^|\r\n|\n)/g,"$1\t")+val.substring(end);
                this.selectionStart=start;
                this.selectionEnd=end+tp.match(/(^|\r\n|\n)/g).length;
            }
            else
            {
                if (document.queryCommandSupported('insertText'))
                {
                    document.execCommand('insertText', false, "\t");
                }
                else
                {
                    this.value = val.substring(0, start) + '\t' + val.substring(end);
                    this.selectionStart = this.selectionEnd = start + 1;
                }
            }
            renderMD();

            return false;
        }
    };
}
function fillProfile()
{
    if ($("#ptitle")[0].value=="")
    {
        var q=$("#preViewCont > h1");
        if (q.length>0)
            $("#ptitle")[0].value=q.text();
    }
}
function gleanAbstract()
{
    var vp=$("<div>").html(editor_js.mdconverter_abs.makeHtml($("#sourceTA")[0].value).replace(/linenums/g,"line-nums"));
    var el=vp.children(":not(h1,h2,h3,script)");
    console.log(el);
    var i=0,ins=el.length,ttc=0;
    var virtualNode=$("<div>");
    while (i<ins && ttc<editor_js.abstract_length)
    {
        ttc+=el[i].innerText.length;
        virtualNode.append($(el[i]).clone());
        i++;
    }
    editor_js.abstract=virtualNode.html();
}
function postIt(callb)
{
    showCover("Communicating with server, wait a moment...");
    fillProfile();
    gleanAbstract();
    var postBody=
    {
        title: $("#ptitle")[0].value,
        catalog: $("#pcata")[0].value,
        preview: editor_js.abstract,
        order: $("#phide").hasClass("checkBox_white_chosen")?-1:($("#ptop").hasClass("checkBox_white_chosen")?10:0),
        author: $("#pau")[0].value,
        tag: $("#ptag")[0].value.split(" ").filter(function(p){return p!=""}),
        img: $("#pimg")[0].value,
        reftime: $("#preftime").hasClass("checkBox_white_chosen"),
        content: $("#sourceTA")[0].value,
        token: editor_js.tmpToken
    };
    var dst;
    if (editor_js.docName=="")
    {
        dst=editor_js.API_INFO;
    }
    else
    {
        dst=editor_js.API_INFO2+"?pid="+editor_js.docName;
    }

    $.post(dst,
    {
        val: JSON.stringify(protocolInfo.secure(postBody))
    },function(data)
    {
        var ps;
        var onErr=function(code)
        {
            showCover("Uh... There are problems while communicating. CODE="+code,false);
            setTimeout(hideCover,4000);
        }
        try
        {
            ps=JSON.parse(data);
        }
        catch (e)
        {
            onErr(protocolInfo.generalRes.statusCode.FRONT_END_ERROR);
            return;
        }
        if (ps.status>=protocolInfo.LEAST_ERR)
        {
            onErr(ps.status);
            return;
        }
        callb(protocolInfo.ansisecure(ps.content).url, postBody);
    });
}

setShortcut();
effect_helper.addShortcut("bc", function() {
    editor_js.toBroadcast=true;
    alert("Enable broadcast!");
});
