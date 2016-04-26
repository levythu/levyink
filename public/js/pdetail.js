$(document).ready(function()
{
    fetchFont();
    p_detail=protocolInfo.ansisecure(p_detail);
    procDocs();
    loadSelectedImg();
    called_on_loaded();
});

function procDocs()
{
    if ($("#blogCont > h1").length==0)
    {
        $("#blogCont").prepend($("<h1>").html(p_detail.title));
    }
    $("#blogCont > h1").after($("<p class='byline'>").html(
        "<span class='inlineblock nowrapper'> -- by "+p_detail.author+",</span>"+
        "&nbsp;&nbsp;&nbsp;&nbsp;"+
        "<span class='inlineblock nowrapper'>"+formatDate(p_detail.pubtime)+"</span>"
    ));
    if (p_detail.tag.length>0)
    {
        var tagstr="";
        for (var i=0;i<p_detail.tag.length;i++)
            tagstr+=(i==0?"":",&nbsp;&nbsp;")+p_detail.tag[i];
        $("#lafin").before($("<p class='byline'>").html("<span class='icon-price-tags'></span>&nbsp;&nbsp;Tags:&nbsp;&nbsp;"+tagstr));
    }
    $(".tem_cata").text(p_detail.catalog);
    prettyPrint();
}


function loadSelectedImg()
{
    if (p_detail.img==undefined || p_detail.img=="")
        return;
    var imgBuf=new Image;
	imgBuf.onload=function()
	{
        $("#giPic").css("background-image", 'url("'+imgBuf.src+'")');
	}
	imgBuf.src=p_detail.img;
}
