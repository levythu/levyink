$(document).ready(function()
{
    procDocs();
});

function procDocs()
{
    $("#contentMain > h1").after($("<p class='byline'>").html(
        "<span class='inlineblock'> -- by "+p_detail.author+",</span>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;"+
        "<span class='inlineblock'>"+formatDate(p_detail.pubtime)+"</span>"
    ));
    if (p_detail.tag.length>0)
    {
        var tagstr="";
        for (var i=0;i<p_detail.tag.length;i++)
            tagstr+=(i==0?"":",&nbsp;&nbsp;")+p_detail.tag[i];
        $("#lafin").before($("<p class='byline'>").html("<span class='icon-price-tags'></span>&nbsp;&nbsp;Tags:&nbsp;&nbsp;"+tagstr));
    }
    $(".tem_cata").text(p_detail.catalog);
}
