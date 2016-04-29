var commentsCanvas_js={};

$(document).ready(function()
{
    var MAX_Y_SPACE_IN_PX=200;
    var Y_SPACE_INCREMENT=2;    // deprecated
    var TILE_MIN_X=100;
    var TILE_MIN_Y=70;
    var PADDING_VALUE_OF_TILE=20;
    var DECLARATION_API="http://192.168.1.91:2333/rest/nonauthorized/tiles/declare";
    DECLARATION_API="/rest/nonauthorized/tiles/declare";
    DECLARATION_API="https://www.levy.at/rest/nonauthorized/tiles/declare";

    var SET_API="http://192.168.1.91:2333/rest/nonauthorized/tiles/set";
    SET_API="/rest/nonauthorized/tiles/set";
    SET_API="https://www.levy.at/rest/nonauthorized/tiles/set";

    var DISCARD_API="http://192.168.1.91:2333/rest/nonauthorized/tiles/discard";
    DISCARD_API="/rest/nonauthorized/tiles/discard";
    DISCARD_API="https://www.levy.at/rest/nonauthorized/tiles/discard";

    var LIST_API="http://192.168.1.91:2333/rest/nonauthorized/tiles/list";
    LIST_API="/rest/nonauthorized/tiles/list";
    LIST_API="https://www.levy.at/rest/nonauthorized/tiles/list";

    var UPPEST_API="http://192.168.1.91:2333/rest/nonauthorized/tiles/uppesty";
    UPPEST_API="/rest/nonauthorized/tiles/uppesty";
    UPPEST_API="https://www.levy.at/rest/nonauthorized/tiles/uppesty";

    var PREFIX_TILE="tile_";
    commentsCanvas_js.PREFIX_TILE=PREFIX_TILE;
    var ONCE_LOADING_HEIGHT=3000;

    var globalDeltaY=0;
    var uppestY=0;
    var downestY=-1994;
    var moveDownwardsRunning=false

    // invoked per tick to move a little

    function init() {
        $(".elemTile").each(function(id, dom){
            var i=parseInt($(dom).css("top"));
            $(dom).attr("lvTargetTop", i);
        });
    }
    init();

    function startMoveDownwards() {
        if (MAX_Y_SPACE_IN_PX-uppestY<=globalDeltaY)
            return;
        var deltaD=MAX_Y_SPACE_IN_PX-uppestY-globalDeltaY;
        globalDeltaY=MAX_Y_SPACE_IN_PX-uppestY;
        $("#commentsCanvas").css("height", globalDeltaY+downestY+PADDING_VALUE_OF_TILE*2+"px");
        $(".elemTile").each(function(id, dom){
            var i=parseInt($(dom).attr("lvTargetTop"));
            if (isNaN(i)) console.error(dom, $(dom).attr("lvTargetTop"));
            $(dom).attr("lvTargetTop", i+deltaD)
                  .css("top", i+deltaD+"px");
            //$(dom).css("top", "+="+deltaD);
        });
        return;
    }

    function pendingCanvas() {
        $("#commentsCanvas").css("pointer-events", "none");
    }
    function allowingCanvas() {
        $("#commentsCanvas").css("pointer-events", "auto");
    }

    var status=0;   // 0: ready; 1: editing;
    var workingDOM;
    var tileList={};

    // x1<x2 && y1<y2, declareTile use unbiased position
    function declareTile(x1, y1, x2, y2, dom, ifSucc, ifFail) {
        pendingCanvas();
        $.post(DECLARATION_API, {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        }, function(data)
        {
            var code=(JSON.parse(data)).status;
            if (code<protocolInfo.LEAST_ERR)
            {
                ifSucc(JSON.parse(data));
            }
            else
            {
                ifFail();
            }
        }).fail(function() {
            ifFail();
        }).always(allowingCanvas);
    }

    function setTile(tid, contentObj, ifSucc, ifFail) {
        var obj2={};
        for (var i in contentObj) obj2[i]=contentObj[i];
        $.post(SET_API, {
            tid: tid,
            val: JSON.stringify(protocolInfo.secure(obj2))
        }, function(data)
        {
            var code=(JSON.parse(data)).status;
            if (code<protocolInfo.LEAST_ERR)
            {
                ifSucc(JSON.parse(data));
            }
            else
            {
                ifFail();
            }
        }).fail(function() {
            ifFail();
        });
    }

    // discard the original workingDOM, or save it.
    function switchWork() {
        var nw=gleanInfo();
        var tid=workingDOM.attr("id").substr(PREFIX_TILE.length);
        if (nw!=undefined && confirm("Save the current tile?"))
        {
            workingDOM.addClass("tileUndeclared");
            setTile(tid, nw, function() {
                updateTile(tid, {
                    status: 1,
                    content: nw
                });
                renderTile(tid);
            }, function() {
                removeTile(tid);
            });
        } else {
            discardTile(tid);
            removeTile(tid);
        }
        $("#editTile").css("visibility", "hidden");
        workingDOM=undefined;
        status=0;
    }

    // start editing one DOM
    // use biased position
    function editDOM(elem, ax1, ay1, ax2, ay2) {
        status=1;
        workingDOM=elem;
        useTextMode();
        $("#editTile").css("left",   ax1+"px")
                      .attr("lvTargetTop", ay1)
                      .css("top",    ay1+"px")
                      .css("width",  ax2-ax1+"px")
                      .css("height", ay2-ay1+"px")
                      .css("visibility", "inherit");
        $("#editTileText").focus();
    }

    function discardTile(tid, ifSucc, ifFail) {
        $.post(DISCARD_API, {
            tid: tid
        }, function(data)
        {
            var code=(JSON.parse(data)).status;
            if (code<protocolInfo.LEAST_ERR)
            {
                if (ifSucc)
                    ifSucc(JSON.parse(data));
            }
            else
            {
                if (ifFail)
                    ifFail();
            }
        }).fail(function() {
            if (ifFail)
                ifFail();
        });
    }

    function removeTile(tid) {
        var tileid=PREFIX_TILE+tid;
        $("#"+tileid).remove();
        delete tileList["tid"];
    }
    commentsCanvas_js.removeTile=removeTile;

    function renderTile(tid) {
        var tileid=PREFIX_TILE+tid;
        var job=$("#"+tileid);
        if (job.length==0) {
            if (! (tid in tileList))
                return;
            job=$("<div class='elemTile' id='"+tileid+"'>")
                .css("left", tileList[tid].x1+"px")
                .attr("lvTargetTop", tileList[tid].y1+globalDeltaY)
                .css("top", tileList[tid].y1+globalDeltaY+"px")
                .css("width", tileList[tid].x2-tileList[tid].x1+"px")
                .css("height", tileList[tid].y2-tileList[tid].y1+"px");
            $("#commentsCanvas").append(job);
        }

        if (! (tid in tileList))
            removeTile(tid);
        else {
            if (tileList[tid].status==1) {
                job.removeClass("tileUndeclared");
                if (tileList[tid].content.istext) {
                    if (job.children(".normalText").length==0) {
                        if (tileList[tid].content.html===true)
                            job.append($("<div class='fullStretch normalText'>").html(
                                tileList[tid].content.value).css("white-space", "normal")
                            );
                        else
                            job.append($("<div class='fullStretch normalText'>").text(tileList[tid].content.value));
                    }
                } else {
                    job.css("background-size", "cover")
                       .css("background-image", "url("+tileList[tid].content.value+")");
                }
            } else if (tileList[tid].status==2) {
                job.addClass("tileUndeclared");
            } else if (tileList[tid].status==-1) {
                removeTile(tid);
            }
        }

    }

    function updateTile(tid, anything) {
        if (! (tid in tileList))
            tileList[tid]={};
        for (i in anything)
        {
            tileList[tid][i]=anything[i];
        }
        if (tileList[tid].status>=0 && tileList[tid].y2>downestY)
        {
            downestY=tileList[tid].y2
            $("#commentsCanvas").css("height", globalDeltaY+downestY+PADDING_VALUE_OF_TILE*2+"px");
        }
        if (tileList[tid].status>=0 && tileList[tid].y1<uppestY)
        {
            uppestY=tileList[tid].y1;
            startMoveDownwards();
        }
    }

    // checkInTile use unbiased position
    function checkInTile(tid, x1, y1, x2, y2, status)
    {
        // status: 1: fixed; 2: editing
        updateTile(tid, {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            status: status
        });
    }


    // START TO IMPLEMENT DRAG EVENTS
    var isDragging=false;
    var startPointX=0;
    var startPointY=0;
    $("#commentsCanvas").mousedown(function(e) {
        isDragging=true;
        startPointX=e.pageX-$("#commentsCanvas").offset().left+$("#commentsCanvas").scrollLeft();
        startPointY=e.pageY-$("#commentsCanvas").offset().top;
        $("#shadowSelect").css("width", "0px")
                          .css("height", "0px")
                          .css("visibility", "inherit");
    });
    $("body").mouseup(function(e) {
        $("#shadowSelect").css("visibility", "hidden");
        nowX=e.pageX-$("#commentsCanvas").offset().left+$("#commentsCanvas").scrollLeft();
        nowY=e.pageY-$("#commentsCanvas").offset().top;
        var p1x=Math.min(startPointX, nowX);
        var p1y=Math.min(startPointY, nowY);
        var p2x=nowX+startPointX-p1x;
        var p2y=nowY+startPointY-p1y;

        isDragging=false;

        if (status==1)
            switchWork();

        if (p2x-p1x<TILE_MIN_X || p2y-p1y<=TILE_MIN_Y)
            return;

        // TODO
        if (p1x<0 || p1y<0 || p2x>$("#commentsCanvas")[0].offsetWidth)
            return;
        var newTileDOM=$("<div class='elemTile tileUndeclared'>").css("left", p1x+"px")
                                                                 .attr("lvTargetTop", p1y)
                                                                 .css("top", p1y+"px")
                                                                 .css("width", p2x-p1x+"px")
                                                                 .css("height", p2y-p1y+"px");
        $("#commentsCanvas").append(newTileDOM);
        var ubp1y=p1y-globalDeltaY;
        var ubp2y=p2y-globalDeltaY;
        declareTile(p1x, ubp1y, p2x, ubp2y, newTileDOM, function(resJSON) {
            newTileDOM.attr("id", PREFIX_TILE+resJSON.tid);
            newTileDOM.removeClass("tileUndeclared");
            checkInTile(resJSON.tid, p1x, ubp1y, p2x, ubp2y, 2);
            editDOM(newTileDOM, p1x, ubp1y+globalDeltaY, p2x, ubp2y+globalDeltaY);
        }, function() {
            // on fail
            newTileDOM.remove();
            setTimeout(fetchData, 0);
        });

    });
    $("#commentsCanvas").mousemove(function(e) {
        if (isDragging)
        {
            nowX=e.pageX-$("#commentsCanvas").offset().left+$("#commentsCanvas").scrollLeft();
            nowY=e.pageY-$("#commentsCanvas").offset().top;
            var p1x=Math.min(startPointX, nowX);
            var p1y=Math.min(startPointY, nowY);
            var p2x=nowX+startPointX-p1x;
            var p2y=nowY+startPointY-p1y;
            $("#shadowSelect").css("left", p1x+"px")
                              .css("top", p1y+"px")
                              .css("width", p2x-p1x+"px")
                              .css("height", p2y-p1y+"px");
        }
    });
    // END TO IMPLEMENT DRAG EVENT

    // START TO IMPLEMENT EDIT TILE
    var isTextMode=true;
    $("#editTile").mousedown(function(e){
        e.stopPropagation();
    }).mouseup(function(e){
        e.stopPropagation();
    }).click(function(e){
        e.stopPropagation();
    });
    function useTextMode()
    {
        $("#editTileText").attr("placeholder", "Type content, or double click to use image.")
                          .css("visibility", "inherit");
        $("#editTileText")[0].value="";
        $("#editTile").css("background-color", "white")
                      .css("background-image", "");
        isTextMode=true;
    }
    function useGraphMode()
    {
        $("#editTileText").attr("placeholder", "Type https image url and press ENTER for preview, or double click to use text.")
                          .css("visibility", "inherit");
        $("#editTileText")[0].value="";
        $("#editTile").css("background-color", "#EEEFD1")
                      .css("background-image", "");
        isTextMode=false;
    }
    // undefined for nothing
    function gleanInfo() {
        var v=$("#editTileText")[0].value;
        if (v=="")
            return undefined;
        return {
            istext: isTextMode,
            value:  v
        };
    }
    $("#editTile").dblclick(function(e) {
        e.stopPropagation();
        if (isTextMode)
            useGraphMode();
        else
            useTextMode();
    });
    $("#editTileText").keypress(function(e){
        if (e.keyCode==13 && !isTextMode)
        {
            e.stopPropagation();
            var url=$("#editTileText")[0].value;
            if (!(url.toLowerCase().indexOf("https://")===0))
            {
                $("#editTileText")[0].value="URL must starts with https://";
                return;
            }
            // SHOW PREVIEW
            $("#editTileText").css("visibility", "hidden");
            $("#editTile").css("background-image", "url("+url+")");
        }
    });
    // END TO IMPLEMENT EDIT TILE



    // START TO IMELEMENT FETCHER
    var lastFetch=0;
    var scopeY=-19940701;
    var updateFetching=false;
    var fInited=false;
    function fetchLeastY(succ, fail) {
        $.get(UPPEST_API, function(data)
        {
            var code=(JSON.parse(data)).status;
            if (code<protocolInfo.LEAST_ERR)
            {
                downestY=scopeY=(JSON.parse(data)).value;
                succ();
            }
            else
            {
                fail();
            }
        }).fail(function() {
            fail();
        });
    }
    // unbiased y
    function fetchData(isUpdate) {
        var query="";
        if (!fInited)
            return;
        if (isUpdate==undefined)
            isUpdate=false;
        if (isUpdate)
        {
            // update mode;
            if (updateFetching)
                return;
            updateFetching=true;
            isUpdate=true;
            query="?updatesince=0&new=1&ymax="+(scopeY+ONCE_LOADING_HEIGHT)+"&ymin="+scopeY;
        } else {
            // patching mode;
            query="?updatesince="+lastFetch+"&ymax="+scopeY;
        }
        function ifSucc(obj) {
            var cList=obj.content;
            for (var i=0; i<cList.length; i++) {
                var thisOne=cList[i];
                var tid=thisOne.tid;
                delete thisOne["tid"];
                if ("content" in thisOne)
                    protocolInfo.ansisecure(thisOne.content);
                updateTile(tid, thisOne);
                renderTile(tid);
            }
            if (cList.length>0 && isUpdate) {
                scopeY+=ONCE_LOADING_HEIGHT;
            }
            if (!isNaN(parseInt(obj.timestamp)) && !isUpdate)
                lastFetch=parseInt(obj.timestamp);
            if (isUpdate)
                updateFetching=false;
        }
        function ifFail() {
            if (isUpdate)
                updateFetching=false;
        }

        $.get(LIST_API+query, function(data)
        {
            var code=(JSON.parse(data)).status;
            if (code<protocolInfo.LEAST_ERR)
            {
                ifSucc(JSON.parse(data));
            }
            else
            {
                ifFail();
            }
        }).fail(function() {
            ifFail();
        });
    }
    function initFetch() {
        fetchLeastY(function(){
            fInited=true;
            fetchData(true);
            setInterval(fetchData, 5000);
        }, function(){
            setTimeout(initFetch, 1000);
        });
    }

    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > Math.min(scopeY, downestY)+globalDeltaY+$("#commentsCanvas").offset().top-100) {
            fetchData(true);
        }
    });
    // END TO IMELEMENT FETCHER

    //startMoveDownwards();


    initFetch();

    startMoveDownwards();
});
