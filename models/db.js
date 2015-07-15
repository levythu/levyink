var mongojs = require('mongojs');
var AUTHOR = "author";
var BLOG = "blog";

exports.AUTHOR = AUTHOR;
exports.BLOG = BLOG;

exports.db = mongojs('mongodb://localhost/levyink', [AUTHOR,BLOG]);

exports.getIDClass=function(idValue)
{
    idValue=""+idValue;
    return mongojs.ObjectId(idValue);
}
