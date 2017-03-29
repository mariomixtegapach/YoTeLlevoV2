var Dao = require('../dbo/modules_v2/Dbo');
var Model = require('../models/Point');
var common = require('../dbo/modules_v2/Dbo.common');
var q = require('q');
var qr = require('qr-image');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');
var CryptoJS = require("crypto-js");
var ImageService = require("./../modules/imageSaver");
var collections = require('./../dbo/collections');

var dao = null;

var PointsService = function(config){
    dao = new Dao({
        model : Model,
        collection : collections.Points
    });
    
    return {
        CreatePoint : function(point){
           var defer = q.defer();
            var sanItem = common.secureCopyV2(Model,point);
            if(common.required(sanItem,["lat","lng","name","formattedAddress","userId"])) {

                sanItem._id = new ObjectId();
                
                
                    dao.push(sanItem).then(function(done){
                        defer.resolve(done);
                    }, function(err){
                        console.log(err);
                        defer.reject(err);
                    });
                
            } else {
                console.log(sanItem);
                defer.reject(new Error('Invalid point input'));
            }

            return defer.promise;
        }, 
        DeletePoint : function(pointId){
            return dao.remove({
                _id : new ObjectId(pointId)
            });
        },
        GetPointsByUserId : function(userId, page){
            return dao.get({
                userId :userId
            }, {
                pageSize : 10,
                page : page
            });
        }
    };
};



module.exports = PointsService;