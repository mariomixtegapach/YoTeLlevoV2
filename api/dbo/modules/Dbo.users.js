var Dbo = require('./Dbo');
var q = require('q');
var _ = require('underscore');
var UsersRequest = require('../requests/Dbo.request.users');
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
    var validReq = extend(new UsersRequest(), req);
   // console.log(req);
    var where = { $or : [] };

    if(validReq._id !== null){
        where.$or.push({_id: new ObjectId(validReq._id)});
    }

    if(validReq.query !== null){
        where.$or.push({
            name: new RegExp(validReq.query)
        });

        where.$or.push({
            lastname: new RegExp(validReq.query)
        });

        where.$or.push({
            username: new RegExp(validReq.query)
        });
    }

    if(validReq.username !== null){
        where.$or.push({
           username: validReq.username
        });
    }

    if(validReq.credit !== null){
        where.$or.push({credit: validReq.credit});
    }

    if(validReq.userType !== null){
        where.$or.push({userType: validReq.userType});
    }
    
    if(validReq.login.password !== null && validReq.login.username !== null){
        where.$or.push({ 
            password:validReq.login.password,
            username:validReq.login.username
        });
    }

    return where.$or.length ? where : {};
};

var tt = function(config, overrides) {
   return Dbo(getWhereObject, collections.Users, overrides, config);
}
module.exports = tt;