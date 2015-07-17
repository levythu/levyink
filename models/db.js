var mongojs = require('mongojs');
var AUTHOR = "author";
var BLOG = "blog";
var METADATA = "metadata"

exports.AUTHOR = AUTHOR;
exports.BLOG = BLOG;
exports.METADATA = METADATA; //{type:"overview"/"visit"}

exports.db = mongojs('mongodb://localhost/levyink', [AUTHOR,BLOG,METADATA]);

exports.getIDClass=function(idValue)
{
    idValue=""+idValue;
    return mongojs.ObjectId(idValue);
}
