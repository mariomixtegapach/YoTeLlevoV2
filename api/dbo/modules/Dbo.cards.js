var Dbo = require('./Dbo');
var PaymentRequest = require('../requests/Dbo.request.cards.js');
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
    var validReq = extend(new PaymentRequest(), req);

    var where = { $or : [] };

    if(validReq.userId){
        where.$or.push({userId: validReq.userId});
    }

    if(validReq.creditId){
        where.$or.push({_id:new ObjectId(validReq.creditId)});
    }

   // console.log("Obteniendo where", where);

    return where.$or.length ? where : {};
};

var tt = function(config, overrides) {
    return Dbo(getWhereObject, collections.Cards, overrides, config);
};

module.exports = tt;