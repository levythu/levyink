var blog_js=
{
    fetchcount: 4,
    isLoading: false,
    isError: false,
    nowPage: 0,
    totalblog: 0,
    triggeredMove: false,
    searchStr: "filter=none",
    search_Res: [],
    digest: [],
    lastPage: 0,
};

$(document).ready(function()
{
    //$(window).resize(updateUI);
    $("#choosePage").tap(function()
    {
        return false;
    });

    $(".dirButton").taphold(function()
    {
        if ($(this).hasClass("disButton")) return;
        if (blog_js.triggeredMove)
            return;
        $("#fullPageFlip").removeClass("nonexist");
        return false;
    });
    $("body").tap(function() {
        $("#fullPageFlip").addClass("nonexist");
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
        window.location=function_helper.url_blog;
    });
    $("#searchBoxDetail").bind('input propertychange', function() {
        filterSearch($("#searchBoxDetail")[0].value);
    });
    $("#searchBoxDetail").keydown(function(e) {
        var keyc=e.which;
        if (keyc===13) {
            e.preventDefault();
        }
    });
    $("#searchBoxDetail").keyup(function(e) {
        var keyc=e.which;
        if (keyc===13) {
            window.location=function_helper.url_blog+"?searchby=any&key="+$("#searchBoxDetail")[0].value;
            e.preventDefault();
        }
    });
    $("#searchBoxDetail").focus(function() {
        if (blog_js.nowPage>=0) {
            blog_js.lastPage=blog_js.nowPage;
            window.location.hash="-1";
        }
    });
    $("#blogboard").tap(function(e) {
        e.stopPropagation();
    });
    $("#searchBox").tap(function(e) {
        e.stopPropagation();
    });
    $("body").tap(function(e) {
        if (blog_js.nowPage<0) {
            window.location.hash=blog_js.lastPage;
        }
    });
    window.onhashchange=function()
    {
        var sp;
        if (!isNaN(-(-window.location.hash.substr(1))))
            sp=Math.round(-(-window.location.hash.substr(1)));
        else
            sp=0;
        if (sp!=blog_js.nowPage)
        {
            blog_js.nowPage=sp;
            refreshData();
        }
    }
    effect_helper.addShortcut("se", function() {
        blog_js.lastPage=blog_js.nowPage;
        window.location="#-1";
    });

    detQuery();
    if (!isNaN(-(-window.location.hash.substr(1))))
        blog_js.nowPage=Math.round(-(-window.location.hash.substr(1)));
    refreshData();
    fetchFont("https://"+function_helper.hostname+
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
    } else if (sb=="any") {
        blog_js.searchStr="filter=any&key="+ct;
        $("#condline_c").html("<span style='color:#707070'>"+ct+"</span>");
        $("#condline").removeClass("nonexist-noblock");
    }
}

function showLoading()
{
    $("#loadingFrame").css("height",$("#heightMeasure")[0].offsetHeight);
    blog_js.isLoading=true;
    setTimeout(function() {
        if (blog_js.isLoading)
            $("#loadingFrame").css("height", "auto");
    }, 300);
}
function hideLoading()
{
    if (!blog_js.isLoading)
        return;
    $("#loadingFrame").css("height",$("#heightMeasure")[0].offsetHeight);
    var useless=$("#loadingFrame").css("height");
    $("#loadingFrame").css("height",0);
    blog_js.isLoading=false;
}
function showError()
{
    $("#errorFrame").css("height",$("#heightMeasure2")[0].offsetHeight);
    blog_js.isError=true;
    setTimeout(function() {
        if (blog_js.isError)
            $("#errorFrame").css("height", "auto");
    }, 300);
}
function hideError()
{
    if (!blog_js.isError)
        return;
    $("#errorFrame").css("height",$("#heightMeasure2")[0].offsetHeight);
    var useless=$("#errorFrame").css("height");
    $("#errorFrame").css("height",0);
    blog_js.isError=false;
}

function refreshData()
{
    var prev=$("#contentMain").height();
    $("#contentMain").css("min-height", prev+"px");
    $("#blogboard").html("");
    $("#lastPage").removeClass("activeButton").addClass("disButton");
    $("#nextPage").removeClass("activeButton").addClass("disButton");
    showLoading();
    hideError();
    if (blog_js.nowPage>0 || window.location.hash!="")
        window.location.hash=blog_js.nowPage;
    if (blog_js.nowPage<0) {
        $("#searchBox").removeClass("nonexist-shadow");
        $("#searchBoxDetail")[0].focus();
        $("#lastPage").css("visibility", "hidden");
        $("#nextPage").css("visibility", "hidden");
    } else {
        $("#searchBox").addClass("nonexist-shadow");
        $("#lastPage").css("visibility", "visible");
        $("#nextPage").css("visibility", "visible");
    }
    $("#potheader").html("");
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
        $("#contentMain").css("min-height", "0px");
        return;
    }
    if (res.status>=protocolInfo.LEAST_ERR)
    {
        hideLoading();
        showError();
        $("#contentMain").css("min-height", "0px");
        return;
    }
    blog_js.totalblog=res.blog_in_total;
    blog_js.search_Res=entries=res.content;

    if (blog_js.nowPage<0) {
        $("#potheader").html("<p>Quick Search</p>");
        showQuickSearch(res.digest_content);
    }
    for (var i=0;i<entries.length;i++)
    {
        var newNode=$("#blogentry_template > ").clone();
        entries[i]=protocolInfo.ansisecure(entries[i]);
        newNode.find(".tem_cata_tag").css("color",dispenseColor(entries[i].catalog));
        newNode.find(".tem_cata").html(
            "<a class='nil_a' href='"+function_helper.url_blog+"?searchby=catalog&key="+entries[i].catalog+"'>"+
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
            "<a class='no_effect_a' href='"+function_helper.url_blog+"?searchby=author&key="+entries[i].author+"'>"+
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

    var limit=Math.floor($("#fullPageFlip").width()*1.0/60);
    var percentage=100.0/(totalPages>0?totalPages:1);
    var begg=0;
    var endd=totalPages;
    if (totalPages>limit) {
        percentage=100/limit;
        begg=blog_js.nowPage-Math.floor(limit/2);
        endd=begg+limit;
        if (begg<0) {
            begg=0;
            endd=begg+limit;
        } else if (endd>=totalPages) {
            endd=totalPages;
            begg=endd-limit;
        }
    }
    $("#fullPageFlip").html("");
    for (var i=begg;i<endd;i++) {
        var newNode=$("<div class='noBorderbutton'>");
        newNode.text(i+1).css("width", percentage+"%");
        if (i==blog_js.nowPage) {
            newNode.css("background-color", "#ccc")
        }
        newNode.tap((function(num) {
            return function() {
                blog_js.nowPage=num;
                scroll2Top();
                refreshData();
            };
        })(i));
        $("#fullPageFlip").append(newNode);
    }

    if (blog_js.nowPage>0)
        $("#lastPage").addClass("activeButton").removeClass("disButton");
    if (blog_js.nowPage<totalPages-1 && blog_js.nowPage>=0)
        $("#nextPage").addClass("activeButton").removeClass("disButton");

    $("#headline").text(" - Page "+(blog_js.nowPage+1));
    prettyPrint();

    $("#contentMain").css("min-height", "0px");
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
function showQuickSearch(entries, isFull=true) {
    if (isFull) blog_js.digest=entries;
    for (var i=0;i<entries.length;i++) {
        var newNode=$("#qsentry_template > ").clone();
        entries[i]=protocolInfo.ansisecure(entries[i]);
        newNode.find(".qsentry_template_a").text(entries[i].title).attr("href", entries[i].url)
        $("#blogboard").append(newNode);
    }
}
function filterSearch(searchKey) {
    var filteredDigest=[];
    for (var i=0; i<blog_js.digest.length; i++) {
        if (blog_js.digest[i].title.indexOf(searchKey)>=0) {
            filteredDigest.push(blog_js.digest[i]);
        }
    }
    $("#blogboard").html("");
    showQuickSearch(filteredDigest, false);
}
