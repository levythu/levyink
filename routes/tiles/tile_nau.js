var express = require('express');
var router = express.Router();

var protocol=require("../../models/protocols");
var protocolInfo=require("../../models/protocolDeclare");
var model=require("../../models/db");
var lock=require("../../models/lock");

var db=model.db;
var TILE=model.TILE;

/*
** _id: tid string,
** x1, x2, y1, y2: int (x1<x2; y1<y2)
** status: -1: removed; 1: fixed; 2: editing
** updateTime: unixtimestamp(int)
** postTime: unixtimestamp(int)
** content: JSON
** isHTML: boolean
*/

var TILE_MIN_X=100;
var TILE_MIN_Y=70;

router.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    next();
});

router.get('/', function(req, res, next)
{
    res.send("hello from nau!");
});

// if fail, returns ""
// otherwise, returns tid
function findNPost(x1p, y1p, x2p, y2p, callback) {
    function onFail() {
        lock.release("tiles.findNPost");
        callback("");
    }
    lock.acquire("tiles.findNPost", function() {
        db[TILE].find({
            x1: {$lt: x2p},
            x2: {$gt: x1p},
            y1: {$lt: y2p},
            y2: {$gt: y1p},
            status: {$gte: 0}
        }, function(err, docs) {
            if (err || docs.length>0) {
                onFail();
                return;
            }
            db[TILE].insert({
                x1: x1p,
                x2: x2p,
                y1: y1p,
                y2: y2p,
                status: 2,
                updateTime: Date.now()
            }, function(err, rec) {
                if (err || rec.length==0)
                {
                    onFail();
                    return;
                }
                lock.release("tiles.findNPost");
                callback(rec._id.toString());
            });
        });
    });
}

router.post("/declare", function(req, res) {
    var x1=parseInt(req.body.x1);
    var y1=parseInt(req.body.y1);
    var x2=parseInt(req.body.x2);
    var y2=parseInt(req.body.y2);
    if (isNaN(x1+x2+y1+y2)) {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "tid": null
        }));
        return;
    }
    if (x2-x1<TILE_MIN_X || y2-y1<=TILE_MIN_Y) {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "tid": null
        }));
        return;
    }
    findNPost(x1, y1, x2, y2, function(tid) {
        if (tid=="") {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.CREATION_FAIL,
                "tid": null
            }));
            return;
        }
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.NORMAL,
            "tid": tid
        }));
        return;
    });
});

router.post("/discard", function(req, res) {
    var tid=req.body.tid;
    if (tid==undefined) {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "tid": null
        }));
        return;
    }
    db[TILE].update({
        _id: model.getIDClass(tid),
        status: 2
    }, {
        $set: {
            status: -1,
            updateTime: Date.now()
        }
    },{}, function(err, rec) {
        if (err || rec.n==0) {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NO_SUCH_DOCS
            }));
            return;
        }
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.NORMAL
        }));
        return;
    });
});

router.post("/set", function(req, res) {
    var tid=req.body.tid;
    var val=req.body.val;
    if (tid==undefined || val==undefined) {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER,
            "tid": null
        }));
        return;
    }
    var obj2Set=JSON.parse(val);
    db[TILE].update({
        _id: model.getIDClass(tid),
        status: 2
    }, {
        $set: {
            status: 1,
            updateTime: Date.now(),
            postTime: Date.now(),
            content: obj2Set
        }
    }, {}, function(err, rec) {
        if (err || rec.n==0) {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NO_SUCH_DOCS
            }));
            return;
        }
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.NORMAL
        }));
        return;
    });
});

router.get("/list", function(req, res) {
    var updateStart=0;
    if ("updatesince" in req.query)
    {
        var t=parseInt(req.query["updatesince"]);
        if (t>0) updateStart=t;
    }
    var yMax=1024;
    if ("ymax" in req.query)
    {
        var t=parseInt(req.query["ymax"]);
        if (!isNaN(t)) yMax=t;
    }
    var nowTime=Date.now();
    db[TILE].find({
        updateTime: {$gt: updateStart},
        y1: {$lte: yMax}
    }, function(err, docs) {
        if (err)
        {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.DB_ERROR,
                "content": null
            }));
            return
        }
        for (var i=0; i<docs.length; i++)
        {
            docs[i]["tid"]=docs[i]["_id"].toString();
            delete docs[i]["_id"];
        }
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.NORMAL,
            "timestamp": nowTime,
            "content": docs // Note that docs[i].content is secured.
        }));
        return;
    });
});

module.exports = router;
