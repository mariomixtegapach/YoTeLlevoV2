var Dbo = require('./Dbo');
var RatesRequest = require('../requests/Dbo.request.rates');
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
    var validReq = extend(new RatesRequest(), req);
   // console.log(req);
    var where = { $or : [] };
    
    if(validReq._id !== null){
        where.$or.push({_id: new ObjectId(validReq._id)});
    }

    if(validReq.userId !== null){
        where.$or.push({userId: validReq.userId});
    }

    if(validReq.dishId !== null){
        where.$or.push({dishId: validReq.dishId});
    }

    return where.$or.length ? where : {};
};

var tt = function(config, overrides) {
   return Dbo(getWhereObject, collections.Rates, overrides, config);
}
module.exports = tt;

