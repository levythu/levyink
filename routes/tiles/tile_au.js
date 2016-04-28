var express = require('express');
var router = express.Router();

var protocol=require("../../models/protocols");
var protocolInfo=require("../../models/protocolDeclare");
var model=require("../../models/db");
var lock=require("../../models/lock");

var updateTime=require("./tile_nau").u;

var db=model.db;
var TILE=model.TILE;

/*
** _id: tid string,
** x1, x2, y1, y2: int (x1<x2; y1<y2)
** status: -1: removed; 1: fixed; 2: editing
** updateTime: unixtimestamp(int)
** postTime: unixtimestamp(int)
** content: JSON
** {
**      istext: bool
**      value: string
**      [html]: bool
** }
*/

var TILE_MIN_X=100;
var TILE_MIN_Y=70;

router.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    next();
});

router.post('/remove', function(req, res) {
    var tid=req.body.tid;
    var nt=Date.now();
    if (tid==undefined) {
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.INVALID_PARAMETER
        }));
        return;
    }
    db[TILE].update({
        _id: model.getIDClass(tid)
    }, {
        $set: {
            status: -1,
            updateTime: nt
        }
    }, {}, function(err, rec) {
        if (err || rec.n==0) {
            res.send(JSON.stringify({
                "status": protocolInfo.generalRes.statusCode.NO_SUCH_DOCS
            }));
            return;
        }
        updateTime(nt);
        res.send(JSON.stringify({
            "status": protocolInfo.generalRes.statusCode.NORMAL
        }));
        return;
    });
});



module.exports = router;
