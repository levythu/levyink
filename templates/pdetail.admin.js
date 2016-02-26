var pdetail_admin_js=
{
    editor_url: "/editor?pid="
}

function called_on_loaded()
{
    var t=$("#blogCont > h1");
    if (t.length>0)
        t[0].innerHTML+="&nbsp;&nbsp;<span class='editButton'><a href=\""+pdetail_admin_js.editor_url+p_detail.pid+"\">"+"(EDIT)</a></span>";
}
