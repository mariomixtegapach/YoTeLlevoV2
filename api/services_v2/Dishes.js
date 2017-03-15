var Dao = require('../dbo/modules_v2/Dbo');
var Model = require('../models/Dish');
var common = require('../dbo/modules_v2/Dbo.common');
var collection = require('../dbo/collections');
var dao = null;
var q = require('q');
var ObjectId = require('mongodb').ObjectID;

var DishService = function(){
    dao = new Dao({
        model : Model,
        collection : collection.Dishes
    });
    
    return {
        GetDishById : function(dishId){
            var defer = q.defer();

            if(typeof dishId !== 'string') {
                defer.reject(new Error('dishId debe ser una cadena'));
            } else {
               dao.get({_id: new ObjectId(dishId)}).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;    
        },
        GetDishesByQuery : function(query, pageOption){
             var defer = q.defer();

            if(typeof query !== 'string') {
                defer.reject(new Error('query debe ser una cadena'));
            } else {

                var req = new DishReq();

                var where = {  $or : [{
                    name : /query/gmi
                }, {
                    description : /query/gmi
                },{
                    category : /query/gmi
                }]};

                dao.get(where,pageOption).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;  
        },
        GetDishesByLowerPriceThan : function(price,pageOption){
            var defer = q.defer();
            if(isNaN(price)) {
                defer.reject(new Error('price debe ser un numero'));
            } else {
                dao.get({
                    price: {
                        $lte:price
                    }
                },pageOption).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;  
        },
        GetDishesByHigherPriceThan :function(price, pageOption){
            var defer = q.defer();

            if(isNaN(price)) {
                defer.reject(new Error('price debe ser un numero'));
            } else {
                dao.get({
                    price :{
                        $gte:price
                    }
                }, pageOption).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;  
        },
        GetDishesByExactPrice : function(price, pageOption){
            var defer = q.defer();

            if(isNaN(price)) {
                defer.reject(new Error('price debe ser un numero'));
            } else {

                dao.get({price: price}, pageOption).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;  
        },
        GetDishesByCategories : function(category,pageOption){
            var defer = q.defer();

            if(!category) {
                defer.reject(new Error('category debe ser un string'));
            } else {
                dao.get({ category: category},pageOption).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;
        },
        GetAll : function(pageOption){
            var defer = q.defer();

            dao.Dishes.get({},pageOption).then(function(dishes){
                defer.resolve(dishes);
            }, function(err){
                console.log(err);
                defer.reject(err);
            });
            

            return defer.promise; 
        },
        UpdateDishById : function(dishId, dishItem){
            var defer = q.defer();

            if(typeof dishId !== 'string') {
                defer.reject(new Error('dishId debe ser una cadena'));
            } else {

                dao.update({ _id : new ObjectId(dishId)}, dishItem).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;    
        },
        DeleteDishById : function(dishId){
            var defer = q.defer();

            if(typeof dishId !== 'string') {
                defer.reject(new Error('dishId debe ser una cadena'));
            } else {

                dao.remove({ _id : new ObjectId(dishId)}).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;
        },
        InsertDish: function(dish){
            var defer = q.defer();


            var doSave = function(){
                dao.push(dish).then(function(dishItem){
                    defer.resolve(dishItem);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            };

                ImageService.SaveImage('public/cdn/dishes/',dish.photoUri).then(function(data){
                    dish.photoUri = data.host + '/cdn/dishes/'+ data.imgName;
                    doSave();
                }, function(err){
                    console.log(err);
                    dish.photoUri = ("http://" + (process.env.OPENSHIFT_GEAR_DNS || "localhost:3000")) + '/cdn/dishes/default.png';
                    doSave();
                });

            return defer.promise;


        }

    };
};



module.exports = DishService;