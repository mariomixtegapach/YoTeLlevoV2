var Dbo = require('./Dbo');
var CategoriesReq = require('../requests/Dbo.request.categories.js');
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
    var validReq = extend(new CategoriesReq(), req);

    var where = { };

    if(validReq.category !== null){
        where.category = validReq.category;
    }

    if(validReq.id !== null){
        where._id = new ObjectId(validReq.id);
    }

   // console.log("Obteniendo where", where);

    return where;
};

var tt = function(config, overrides) {
    return Dbo(getWhereObject, collections.Categories, overrides, config);
};

module.exports = tt;