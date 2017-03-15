var Dbo = require('./Dbo');
var q = require('q');
var _ = require('underscore');
var DishesRequest = require('../requests/Dbo.request.dishes');
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
    var dishReq = extend(new DishesRequest(), req);
    var where = { $or : [] };

    if(dishReq.id !== null){
        where.$or.push({_id: new ObjectId(dishReq.id)});
    }

    if(dishReq.query !== null){
        where.$or.push({
            name: new RegExp(dishReq.query,'gmi')
        });

        where.$or.push({
            description: new RegExp(dishReq.query,'gmi')
        });
    }

    if(dishReq.exatcPrice !== null){
        where.$or.push({
            price: dishReq.exatcPrice
        });
    }


    if(dishReq.lowerPriceThan !== null){
        where.$or.push({
            price: { $lt : dishReq.lowerPriceThan }
        });
    }

    if(dishReq.higerPriceThan !== null){
        where.$or.push({
            price: { $gt : dishReq.higerPriceThan }
        });
    }

    if(dishReq.ingredients !== null && Array.isArray(dishReq.ingredients)){
        where.$or.push({
            'ingredients._id' : {
                $in : dishReq.ingredients
            }
        })
    }

    if(dishReq.category !== null){
        where.$or.push({
            'category' : dishReq.category
        })
    }

    return where.$or.length ? where : {};
};



var tt = function(config, overrides) {
   return Dbo(getWhereObject, collections.Dishes, overrides, config); 
}
module.exports = tt;