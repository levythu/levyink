var blog_js=
{
    fetchcount: 10,
    isLoading: false,
    isError: false,
    fetchstart: 0,
    totalblog: 0
};

$(document).ready(function()
{
    $(window).resize(updateUI);
});

function updateUI()
{
    if (blog_js.isLoading)
        $("#loadingFrame").css("height",$("#heightMeasure")[0].offsetHeight);
    if (blog_js.isError)
        $("#errorFrame").css("height",$("#heightMeasure2")[0].offsetHeight);
}

function showLoading()
{
    $("#loadingFrame").css("height",$("#heightMeasure")[0].offsetHeight);
    blog_js.isLoading=true;
}
function hideLoading()
{
    $("#loadingFrame").css("height",0);
    blog_js.isError=false;
}
function showError()
{
    $("#errorFrame").css("height",$("#heightMeasure2")[0].offsetHeight);
    blog_js.isError=true;
}
function hideError()
{
    $("#errorFrame").css("height",0);
    blog_js.isLoading=false;
}

function firstLoadData()
{
    fetchData()
}
function refreshData()
{
    $("#blogboard").html("");
    showLoading();
}
function analyzeData(data)
{
    var res;
    try
    {
        res=JSON.parse();
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
    entries=res.content;

    for (var i=0;i<entries.lengthj;i++)
    {
        var newNode=$("#blogentry_template > ").clone();
        newNode
    }
}
function fetchData(callback)
{
    $.get("/fakeds/blogds?fetchstart="+blog_js.fetchstart+"&fetchcount"+blog_js.fetchcount+"filter=none", function(data)
    {
        callback(data);
    }).fail(function()
    {
        console.log("Failed to fetch data; now organizing re-fetch...");
        fetchData(arguments);
    });
}
