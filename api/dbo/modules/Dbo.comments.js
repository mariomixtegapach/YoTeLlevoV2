var Dbo = require('./Dbo');
var q = require('q');
var _ = require('underscore');
var CommentsRequest = require('../requests/Dbo.request.comments');
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
    var validReq = extend(new CommentsRequest(), req);
   // console.log(req);
    var where = { $or : [] };

    if(validReq.id !== null){
        where.$or.push({_id: new ObjectId(validReq.id)});
    }

    if(validReq.userId !== null){
        where.$or.push({userId: validReq.userId});
    }

    if(validReq.dishId !== null){
        where.$or.push({dishId: validReq.dishId});
    }

    if(validReq.query !== null){
        where.$or.push({
            text: new RegExp(validReq.query)
        });
    }

    return where.$or.length ? where : {};
};

var tt = function(config, overrides) {
   return Dbo(getWhereObject, collections.Comments, overrides, config);
};
module.exports = tt;