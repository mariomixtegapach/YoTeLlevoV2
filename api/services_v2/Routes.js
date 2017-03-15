var Dao = require('../dbo/modules_v2/Dbo');
var CategoryReq = require('../dbo/requests/Dbo.request.categories');
var collections = require('./../dbo/collections');
var Model = require('../models/Category.json');
var common = require('../dbo/modules/Dbo.common');
var categoryDao = null;
var q = require('q');
var ObjectId = require('mongodb').ObjectID;

var CategoryService = function(){
    categoryDao = new Dao({
        model : Model,
        collection : collections.Categories
    });

    return {
        GetRoutes : function(userId, pageOptions){
            var defer = q.defer();

            if(typeof category !== 'string') {
                defer.reject(new Error('category debe ser una cadena'));
            } else {
                categoryDao.get({ category : category},pageOptions).then(function(categories){
                    defer.resolve(categories);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;
        },
        GetCategories : function(pageOptions){
            var defer = q.defer();
                categoryDao.get({},pageOptions).then(function(categories){
                    defer.resolve(categories);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });

            return defer.promise;
        },
        InsertCategory : function(category){
            var defer = q.defer();

                categoryDao.push(category).then(function(item){
                    defer.resolve(item);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });

            return defer.promise;
        },
        DeleteCategory : function(id){
            var defer = q.defer();

                categoryDao.remove({_id : new ObjectId(id)}).then(function(categories){
                    defer.resolve(categories);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });


            return defer.promise;
        },
        UpdateCategory : function(id, category){
            var defer = q.defer();

                categoryDao.update({ _id: new ObjectId(id)},{category : category}).then(function(){
                    defer.resolve({});
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });


            return defer.promise;
        }
    };
};



module.exports = CategoryService;