function Exmap(expTimeInMS, checkTimeInMS)
{
    var that=this;

    if (expTimeInMS==undefined)
        return undefined;
    if (checkTimeInMS==undefined)
        checkTimeInMS=10*expTimeInMS;
    this.exptime=expTimeInMS;
    this.checktime=checkTimeInMS;
    this.innermap={};

    this.checker=setInterval(function() {
        var nt=Date.now();
        for (k in that.innermap) {
            if (that.innermap[k][1]+that.exptime<nt)
                delete that.innermap[k];
        }
    }, this.checktime);
}
Exmap.prototype.Set=function(k, v) {
    this.innermap[k]=[v, Date.now()];
};
Exmap.prototype.Get=function(k) {
    if (! (k in this.innermap)) {
        return undefined;
    }
    var obj=this.innermap[k];
    if (obj[1]+this.exptime<Date.now())
    {
        delete this.innermap[k];
        return undefined;
    }
    return obj[0];
};
Exmap.prototype.Stop=function() {
    clearInterval(this.checker);
};
Exmap.prototype.Has=function(k) {
    if (! (k in this.innermap)) {
        return false;
    }
    var obj=this.innermap[k];
    if (obj[1]+this.exptime<Date.now())
    {
        delete this.innermap[k];
        return false;
    }
    return true;
};

module.exports=Exmap;
