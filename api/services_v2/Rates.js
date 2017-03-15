var Dao = require('../dbo/modules_v2/Dbo');
var RatesReq = require('../dbo/requests/Dbo.request.rates');
var common = require('../dbo/modules_v2/Dbo.common');
var collection = require('../dbo/collections');
var q = require('q');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var dao = null;



var RatesService = function(){
    dao = new Dao({
        model:Model,
        collection :collection.Rates
    });
    
    return {
        RateDish : function(idDish, idUser, rate){
            var defer = q.defer();
            
            if(typeof idDish === 'string' 
            && typeof idUser === 'string'
            && !isNaN(rate)){

                var sanItem = {
                    userId:idDish,
                    dishId:idUser,
                    rate: rate
                };

                dao.push(sanItem).then(function(done){
                    defer.resolve(done);
                }, function(err){
                    defer.reject(err);
                });
            } else {
                defer.reject(new Error('idDish e idUser deben ser strings, rate debe ser entero'));
            }
            
            return defer.promise;
        },
        GetRatesByIdDish : function(idDish, pageOptions){
            var defer = q.defer();

            if(typeof idDish === 'string'){
                dao.Rates.get({ dishId: idDish }, pageOptions).then(function(done){
                    defer.resolve(done);
                }, function(err){
                    defer.reject(err);
                });
            } else {
                defer.reject(new Error('idDish debe ser string'));
            }

            return defer.promise;
        },
        GetRatesByIdUser : function(idUser,pageOptions){
            var defer = q.defer();

            if(typeof idUser === 'string'){

                dao.get({userId : idUser}, pageOptions).then(function(done){
                    defer.resolve(done);
                }, function(err){
                    defer.reject(err);
                });
            } else {
                defer.reject(new Error('idDish debe ser string'));
            }

            return defer.promise;
        },
        UpdateRate : function(idDish, idUser, rate){
            var defer = q.defer();

            if(typeof idDish === 'string'
                && typeof idUser === 'string'
                && !isNaN(rate)){

                dao.update({userId: idUser, dishId: idDish},{rate: rate}).then(function(done){
                    defer.resolve(done);
                }, function(err){
                    defer.reject(err);
                });
            } else {
                defer.reject(new Error('idDish e idUser deben ser strings, rate debe ser entero'));
            }

            return defer.promise;
        },
        DeleteRateById : function(idRate){
            return dao.remove({_id : new ObjectId(idRate)});
        }
    };
};



module.exports = RatesService;