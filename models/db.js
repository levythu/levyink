var mongojs = require('mongojs');
var AUTHOR = "author";

exports.AUTHOR = AUTHOR;

exports.db = mongojs('mongodb://localhost/levyink', [AUTHOR]);

exports.getIDClass=function(idValue)
{
    idValue=""+idValue;
    return mongojs.ObjectId(idValue);
}
