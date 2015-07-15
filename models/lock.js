var lockTable={};

exports.acquire = function(id, callback){
    if(!lockTable[id]){
        lockTable[id] = new Array();
        callback();
    }
    else{
        lockTable[id].push(callback);
    }
};

exports.release = function(id){
    if(lockTable[id]){
        if(lockTable[id].length == 0){
            delete lockTable[id];
        }
        else{
            lockTable[id].shift()();
        }
    }else{
        console.log("release unexisted lock: " + id);
    }
};

exports.test = function(id){
	return lockTable[id] ? true : false;
};
