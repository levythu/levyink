var editor_js=
{
    isTwoView: true,
    docName: "",
    mdconverter: new showdown.Converter()
};

$(document).ready(function()
{
    $(window).resize(updateUI);
    $(".glyph-option").tap(function()
    {
        $(this).parent().children(".glyph-option").removeClass("glyph-option-chosen");
        $(this).addClass("glyph-option-chosen");
    });
    $("#opt_edit").tap(function()
    {
        $("#profileArea").addClass("nonexist");
        $("#sourceCon").removeClass("nonexist");
    });
    $("#opt_prof").tap(function()
    {
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
        //TODO: clean local storage.
    });
    $("html").load(function(){$(window).trigger("resize");});

    $(window).trigger("resize");
    loadData();
    if (editor_js.docName==="")
    {
        setInterval(backupContent,10000);
        $(window).bind("beforeunload", backupContent);
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
    $("#preViewCont").html(editor_js.mdconverter.makeHtml($("#sourceTA")[0].value));
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
}
function showCover(showWord)
{
    $("#promptWord").text(showWord);
    $(window).trigger("resize");
    $("#upperCanvas").removeClass("nonexist");
}
function hideCover()
{
    $("#upperCanvas").addClass("nonexist");
}

function enableTab(id) {
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
