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
    $(".tem_cata").text(p_detail.catalog);
}
