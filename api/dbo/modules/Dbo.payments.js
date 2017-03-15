var Dbo = require('./Dbo');
var PaymentRequest = require('../requests/Dbo.request.payments.js');
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

    if(validReq.orderId){
        where.$or.push({idOrder: validReq.orderId});
    }

    if(validReq.paymentType){
        where.$or.push({paymentType : validReq.paymentType});
    }

    if(validReq.rangeDate
        && validReq.rangeDate.start != null
        && validReq.rangeDate.end != null){

        where.$or.push({
            date : {
                $gt : validReq.rangeDate.start,
                $lt : validReq.rangeDate.end
            }
        });
    }


    return where.$or.length ? where : {};
};

var tt = function(config, overrides) {
    return Dbo(getWhereObject, collections.Payments, overrides, config);
};

module.exports = tt;