var Dao = require('../dbo/modules_v2/Dbo');
var Model = require('../models/Comment.json');
var Collection = require('./../dbo/collections');
var common = require('../dbo/modules_v2/Dbo.common');
var dao = null;
var q = require('q');
var ObjectId = require('mongodb').ObjectID;

var CommentService = function(){
    dao = new Dao({
        model : Model,
        collection : Collection.Comments
    });
    
    return {
        GetCommentById : function(commentId){
            var defer = q.defer();

            if(typeof dishId !== 'string') {
                defer.reject(new Error('commentId debe ser una cadena'));
            } else {

                dao.get({_id : new ObjectId(commentId)}, {page:1 , pageSize : 10}).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;   
        },
        GetCommentsByDishId : function(dishId, pageOptions){
             var defer = q.defer();

            if(typeof dishId !== 'string') {
                defer.reject(new Error('dishId debe ser una cadena'));
            } else {
                dao.get({dishId : dishId}, pageOptions).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;   
        },
        GetCommentsByUserId : function(userId, pageOptions){
            var defer = q.defer();

            if(typeof userId !== 'string') {
                defer.reject(new Error('dishId debe ser una cadena'));
            } else {

                dao.get({userId : userId}, pageOptions).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;   
        },
        
        InsertComment : function(commentItem){
            var defer = q.defer();

                dao.push(commentItem).then(function(result){
                    defer.resolve(result);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });


            return defer.promise;
        }
    };
};



module.exports = CommentService;