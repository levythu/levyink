var mongojs = require('mongojs');
var AUTHOR = "author";
var BLOG = "blog";
var METADATA = "metadata";
var TILE = "tile";

exports.AUTHOR = AUTHOR;
exports.BLOG = BLOG;
exports.TILE = TILE;
exports.METADATA = METADATA; //{type:"overview"/"visit"}

exports.cList=[AUTHOR,BLOG,METADATA,TILE];

exports.db = mongojs('mongodb://localhost/levyink', exports.cList);

exports.getIDClass=function(idValue)
{
    idValue=""+idValue;
    return mongojs.ObjectId(idValue);
}
