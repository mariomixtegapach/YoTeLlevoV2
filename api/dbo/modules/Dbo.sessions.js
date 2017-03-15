var Dbo = require('./Dbo');
var q = require('q');
var _ = require('underscore');
var SessionRequest = require('../requests/Dbo.request.session');
var collections = require('../collections');
var ObjectId = require('mongodb').ObjectID;

var extend = function(org, newObj){
    for(var key in org){
        if(typeof newObj[key] !== 'undefined'){
            org[key] = newObj[key];
        }
    }

    return org;
};

var getWhereObject = function(req){
    var validReq = extend(new SessionRequest(), req);
   // console.log(req);
    var where = { };

    if(validReq.token !== null){
        where.token = validReq.token
    }

    return where;
};

var tt = function(config, overrides) {
    return Dbo(getWhereObject, collections.Session, overrides, config);
}
module.exports = tt;