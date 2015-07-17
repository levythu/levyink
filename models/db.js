var mongojs = require('mongojs');
var AUTHOR = "author";
var BLOG = "blog";
var METADATA = "metadata"

exports.AUTHOR = AUTHOR;
exports.BLOG = BLOG;
exports.METADATA = METADATA; //{type:"overview"/"visit"}

exports.cList=[AUTHOR,BLOG,METADATA];

exports.db = mongojs('mongodb://localhost/levyink', exports.cList);

exports.getIDClass=function(idValue)
{
    idValue=""+idValue;
    return mongojs.ObjectId(idValue);
}
