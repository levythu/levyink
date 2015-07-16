var crypto = require('crypto');

exports.calculateHASH=
function(srcstr)
{
    var sha1Hasher = crypto.createHash('sha1');
    sha1Hasher.update(srcstr);
    return sha1Hasher.digest('hex');
}
