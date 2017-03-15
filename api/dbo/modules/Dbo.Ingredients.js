var Dbo = require('./Dbo');
var q = require('q');
var _ = require('underscore');
var IngredientsRequest = require('../requests/Dbo.request.ingredients');
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
    var validReq = extend(new IngredientsRequest(), req);
    //console.log(req);
    var where = { $or : [] };

    if(validReq.id !== null){
        where.$or.push({_id: new ObjectId(validReq.id)});
    }

    if(validReq.query !== null){
        where.$or.push({
            name: new RegExp(validReq.query)
        });
    }

    return where.$or.length ? where : {};
};


var tt = function(config, overrides) {
   return Dbo(getWhereObject, collections.Ingredients, overrides, config);
}
module.exports = tt;