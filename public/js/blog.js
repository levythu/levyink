var blog_js=
{
    fetchcount: 4,
    isLoading: false,
    isError: false,
    nowPage: 0,
    totalblog: 0,
    triggeredMove: false,
    searchStr: "filter=none",
    search_Res: []
};

$(document).ready(function()
{
    $(window).resize(updateUI);
    $("#choosePage").tap(function()
    {
        return false;
    });

    var bgBW=$(".bigButton")[0].offsetWidth
    var bgBH=$(".bigButton")[0].offsetHeight
    $(".bigButton >").each(function(id,dom)
    {
        $(dom).css("position","absolute")
              .css("left",(bgBW-dom.offsetWidth)*0.5)
              .css("top",(bgBH-dom.offsetHeight)*0.4);
    });
    $(".dirButton").taphold(function()
    {
        if ($(this).hasClass("disButton")) return;
        if (blog_js.triggeredMove)
            return;
        showBlack();
        return false;
    });
    $("#lastPage").tap(function()
    {
        if ($(this).hasClass("disButton")) return;
        blog_js.triggeredMove=true;
        setTimeout(function(){blog_js.triggeredMove=false;},1500);
        blog_js.nowPage--;
        scroll2Top();
        refreshData();
    });
    $("#nextPage").tap(function()
    {
        if ($(this).hasClass("disButton")) return;
        blog_js.triggeredMove=true;
        setTimeout(function(){blog_js.triggeredMove=false;},1500);
        blog_js.nowPage++;
        scroll2Top();
        refreshData();
    });
    $("#refbut").tap(function()
    {
        refreshData();
        $("#refbut").addClass("nonexist-noblock");
    });
    $("#condline").tap(function()
    {
        window.location=function_helper.url_blog+"?toTop=1";
    });

    detQuery();
    refreshData();
    fetchFont("http://"+function_helper.hostname+
        "/rest/nonauthorized/blog/list?fetchstart=0&fetchcount=19940701&"
        +blog_js.searchStr);

    $(window).trigger("resize");
});

function detQuery()
{
    var sb=getParameterByName("searchby");
    var ct=getParameterByName("key");
    if (ct=="" || ct==undefined) return;
    if (sb=="catalog")
    {
        blog_js.searchStr="filter=catalog&key="+ct;
        $("#condline_c").html("@<span style='color:#707070'>"+ct+"</span>");
        $("#condline").removeClass("nonexist-noblock");
    }
    else if (sb=="author")
    {
        blog_js.searchStr="filter=author&key="+ct;
        $("#condline_c").html("by <span style='color:#707070'>"+ct+"</span>");
        $("#condline").removeClass("nonexist-noblock");
    }
}
function updateUI()
{
    if (blog_js.isLoading)
        $("#loadingFrame").css("height",$("#heightMeasure")[0].offsetHeight);
    if (blog_js.isError)
        $("#errorFrame").css("height",$("#heightMeasure2")[0].offsetHeight);
    if ($(window).width()<500)
        $("#cp_container").css("border-width","0.6em");
    else
        $("#cp_container").css("border-width","3em");

    $("#floatBack >").each(function(id,dom)
    {
        $(dom).css("position","absolute")
              .css("left",(dom.parentNode.offsetWidth-dom.offsetWidth)*0.5)
              .css("top",(dom.parentNode.offsetHeight-dom.offsetHeight)*0.4);
    });
}

function showLoading()
{
    $("#loadingFrame").css("height",$("#heightMeasure")[0].offsetHeight);
    blog_js.isLoading=true;
}
function hideLoading()
{
    $("#loadingFrame").css("height",0);
    blog_js.isLoading=false;
}
function showError()
{
    $("#errorFrame").css("height",$("#heightMeasure2")[0].offsetHeight);
    blog_js.isError=true;
}
function hideError()
{
    $("#errorFrame").css("height",0);
    blog_js.isError=false;
}

function refreshData()
{
    $("#blogboard").html("");
    $("#lastPage").removeClass("activeButton").addClass("disButton");
    $("#nextPage").removeClass("activeButton").addClass("disButton");
    showLoading();
    fetchData(analyzeData);
}
function getEmphasis(id)
{
    if (id==10)
        return "[置顶] ";
    else if (id<0)
        return "[隐藏] ";
    return "";
}
function analyzeData(data)
{
    var res;
    try
    {
        res=JSON.parse(data);
    }
    catch (e)
    {
        hideLoading();
        showError();
        return;
    }
    if (data.status>=protocolInfo.LEAST_ERR)
    {
        hideLoading();
        showError();
        return;
    }
    blog_js.totalblog=res.blog_in_total;
    blog_js.search_Res=entries=res.content;

    for (var i=0;i<entries.length;i++)
    {
        var newNode=$("#blogentry_template > ").clone();
        entries[i]=protocolInfo.ansisecure(entries[i]);
        newNode.find(".tem_cata_tag").css("color",dispenseColor(entries[i].catalog));
        newNode.find(".tem_cata").html(
            "<a class='nil_a' href='"+function_helper.url_blog+"?toTop=1&searchby=catalog&key="+entries[i].catalog+"'>"+
            entries[i].catalog+"</a>");
        newNode.find(".tem_title").html("<a class='no_effect_a transit_in_color' href='"+
            entries[i].url+
        "'>"+"<b>"+getEmphasis(entries[i].order)+"</b>"+entries[i].title+
        "</a>");
        newNode.find(".tem_time").text(formatDate(entries[i].pubtime));
        if (entries[i].commentcount>1)
            newNode.find(".tem_com_c").text(entries[i].commentcount+" comments");
        else if (entries[i].commentcount==1)
            newNode.find(".tem_com_c").text(entries[i].commentcount+" comment");
        else
            newNode.find(".tem_com").remove();
        newNode.find(".tem_auth").html(
            "<a class='no_effect_a' href='"+function_helper.url_blog+"?toTop=1&searchby=author&key="+entries[i].author+"'>"+
            entries[i].author+"</a>"
        );
        newNode.find(".tem_cont").html(formatContent(entries[i].preview));

        if (entries[i].order<0) newNode.css("color","#BBBBBB");

        $("#blogboard").append(newNode);

        if (i<entries.length-1)
            $("#blogboard").append($("<div class='blogentry_tem_div'>"));
    }

    $("#choiceBoxSet").html("");
    var totalPages=Math.ceil(blog_js.totalblog/blog_js.fetchcount);
    for (var i=0;i<totalPages;i++)
    {
        var newNode=$("#choiceBoxTemplate >").clone();
        newNode.find(".cbcontent").text(i+1);
        if (i==blog_js.nowPage)
            newNode.addClass("bluechoiceBox");
        newNode.tap(function()
        {
            var num=-(-$(this).text());
            blog_js.nowPage=num-1;
            hideBlack();
            scroll2Top();
            refreshData();
        });
        $("#choiceBoxSet").append(newNode);
    }

    if (blog_js.nowPage>0)
        $("#lastPage").addClass("activeButton").removeClass("disButton");
    if (blog_js.nowPage<totalPages-1)
        $("#nextPage").addClass("activeButton").removeClass("disButton");

    $("#headline").text(" - Page "+(blog_js.nowPage+1));
    prettyPrint();

    $("body").trigger("finishAjaxBlog");

    $(window).trigger("resize");
    hideLoading();
}
function fetchData(callback)
{
    $.get("/rest/nonauthorized/blog/list?fetchstart="+blog_js.nowPage*blog_js.fetchcount+"&fetchcount="+blog_js.fetchcount+"&"+blog_js.searchStr, function(data)
    {
        callback(data);
    }).fail(function()
    {
        console.log("Failed to fetch data; now organizing re-fetch...");
        setTimeout(function(){fetchData(callback);},3000);
    });
}
function showRef()
{
    $("#refbut").html("&nbsp;&nbsp;&nbsp;&nbsp;<span class='icon-spinner11 inlineb' style='font-size:1.3em'></span>")
    $("#refbut").removeClass("nonexist-noblock");
}
