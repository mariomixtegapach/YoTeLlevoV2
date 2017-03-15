var Dbo = require('./Dbo');
var OrdersRequest = require('../requests/Dbo.request.orders');
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
    var validReq = extend(new OrdersRequest(), req);
    console.log(req);
    var where = { $or : [] };

    if(validReq.finished !== null){
        if(validReq.finished){
            where.$or.push({
                payed : true,
                authorized: true,
                userId: validReq.userId
            });
        } else {
            where.$or.push({
                payed : false
            });

            where.$or.push({
                authorized : false
            });

            if(validReq.userId !== null){
                where.$or.push({
                    userId: validReq.userId
                });
            }
        }
    } else {
        if(validReq.userId !== null){
            where.$or.push({
                userId: validReq.userId
            });
        }
    }


    if(validReq.id !== null){
        where.$or.push({_id: new ObjectId(validReq.id)});
    }


    
    if(validReq.dishes !== null && Array.isArray(validReq.dishes)){
        where.$or.push({
            dishes:{
                $elemMatch:{
                    $in: validReq.dishes
                }
            }
        })
    }
    
    
    if(validReq.readyToDelivery !== null){
        if(validReq.readyToDelivery){
            where.$or.push({
                payed : true,
                authorized: false
            });
        } else {
            where.$or.push({
                payed : false,
                authorized: false
            });
        }
    }
    
    if(validReq.finished !== null){
        if(validReq.finished){
            where.$or.push({
                payed : true,
                authorized: true
            });
        } else {
            where.$or.push({
                payed : false
            });
            
            where.$or.push({
                authorized : false
            });
        }
    }
    
    if(validReq.dateRangeOrdered.start !== null && validReq.dateRangeOrdered.end !== null){
        where.$or.push({
           dateOrdered : {
               $gt : validReq.dateRangeOrdered.start,
               $lt : validReq.dateRangeOrdered.end
           } 
        });
    }
    
    if(validReq.dateRangePayed.start !== null && validReq.dateRangePayed.end !== null){
        where.$or.push({
           datePayed : {
               $gt : validReq.dateRangePayed.start,
               $lt : validReq.dateRangePayed.end
           } 
        });
    }

    return where.$or.length ? where : {};
};

var tt = function(config, overrides) {
   return Dbo(getWhereObject, collections.Orders, overrides, config);
}
module.exports = tt;