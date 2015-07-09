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
