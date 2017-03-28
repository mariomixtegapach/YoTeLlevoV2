var Dao = require('../dbo/modules_v2/Dbo');
var Model = require('../models/User.json');
var common = require('../dbo/modules_v2/Dbo.common');
var q = require('q');
var qr = require('qr-image');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');
var CryptoJS = require("crypto-js");
var ImageService = require("./../modules/imageSaver");
var collections = require('./../dbo/collections');

var dao = null;



var UserService = function(config){
    dao = new Dao({
        model : Model,
        collection : collections.Users
    });
    
    return {
        GetUserById : function(userId){
            var defer = q.defer();
            

            if(typeof userId !== 'string'){
                defer.reject(new Error('userId debe ser un string'));
            } else {

                dao.get({ _id : new ObjectId(userId)}).then(function(users){
                    defer.resolve(users);
                }, function(err){
                    defer.reject(err);
                });
            }
            
            return defer.promise;
        },
        GetUsersByQuery: function(query, pageOptions){
            var defer = q.defer();

            if(typeof query !== 'string'){
                defer.reject(new Error('query debe ser un string'));
            } else {

                dao.get({
                    lastname : new RegExp(query,'gmi'),
                    name : new RegExp(query,'gmi'),
                    username : new RegExp(query,'gmi') },pageOptions).then(function(users){
                  defer.resolve(users);
                }, function(err){
                    defer.reject(err);
                });
            }
            
            return defer.promise;
        },
        GetUsersSalers: function(pageOptions){
            var defer = q.defer();

            dao.Users.get({ userType : 1},pageOptions).then(function(users){
              defer.resolve(users);
            }, function(err){
                defer.reject(err);
            });
            
            return defer.promise;
        },
        GetUsersBuyers: function(pageOptions){
            var defer = q.defer();

            dao.Users.get({ userType : 0},pageOptions).then(function(users){
                defer.resolve(users);
            }, function(err){
                defer.reject(err);
            });
            
            return defer.promise;
        },
        GetUserByUsername : function(username){
            var defer = q.defer();

            dao.get({username : new RegExp(username,'gmi') },{page:1, pageSize:10}).then(function(users){
                defer.resolve(users);
            }, function(err){
                defer.reject(err);
            });

            return defer.promise;
        },
        UpdateUserById: function(userId, userItem){
            var defer = q.defer();

            if(typeof userId !== 'string'){
                defer.reject(new Error('userId debe ser un string'));
            } else {
                dao.update({ _id: new ObjectId(userId) },userItem).then(function(users){
                  defer.resolve(users);
                }, function(err){
                    defer.reject(err);
                });
            }
            
            return defer.promise;
        },
        RemoveUserById: function(userId){
            var defer = q.defer();

            if(typeof userId !== 'string'){
                defer.reject(new Error('userId debe ser un string'));
            } else {
                dao.remove({ _id: new ObjectId(userId) }).then(function(users){
                    defer.resolve(users);
                }, function(err){
                    defer.reject(err);
                });
            }

            return defer.promise;
        },
        InserUser: function(userItem){

            var defer = q.defer();
            var sanItem = common.secureCopyV2(Model,userItem);
            if(common.required(sanItem,["userType","name","username","password"])) {

                sanItem._id = new ObjectId();
                var key = CryptoJS.HmacSHA1(sanItem._id.toString(),sanItem._id.toString());
                sanItem.qr = ("http://" + (process.env.OPENSHIFT_GEAR_DNS || "localhost:3000"))+ '/cdn/qr/'+key+'.png';
                var qr_svg = qr.image(sanItem._id.toString(), { type: 'png' });
                qr_svg.pipe(require('fs').createWriteStream('public/cdn/qr/' + key + '.png'));

                var doSave = function(){
                    dao.push(sanItem).then(function(done){
                        defer.resolve(done);
                    }, function(err){
                        console.log(err);
                        defer.reject(err);
                    });
                };

                ImageService.SaveImage('public/cdn/users/',sanItem.photoUri).then(function(data){
                    sanItem.photoUri = data.host + '/cdn/users/'+ data.imgName;
                    doSave();
                }, function(err){
                    console.log(err);
                    sanItem.photoUri = ("http://" + (process.env.OPENSHIFT_GEAR_DNS || "localhost:3000")) + '/cdn/users/default.png';
                    doSave();
                });
            } else {
                console.log(sanItem);
                defer.reject(new Error('Invalid user input'));
            }

            return defer.promise;
        },
        Login : function(username,password){
             var defer = q.defer();
            
            if(typeof username !== 'string' || typeof password !== 'string'){
                defer.reject(new Error('username y password deben ser un string'));
            } else {
               dao.get({username : username, password: password},{page:1,pageSize:10}).then(function(users){
                  if(users.result.length === 1){
                      defer.resolve(users.result[0]);
                  } else {
                      defer.reject(new Error('Usuario o password invalido'));
                  }
                  
                }, function(err){
                    defer.reject(err);
                });
            }
            
            return defer.promise;
        }, 
        CreatePoints : function(id, points){
            var defer = q.defer();
            Model.update({_id : id}, 
            {$push : {points: points}}
            );
            return defer.promise;
        }, 
        DeletePoint : function(id, pointName){
            var defer = q.defer();
            Model.update({_id : id}, 
                {$pull: {points: {name: pointName}}});
            return defer.promise;
        }, 
        AddNotifications : function(notifications){
            var defer = q.defer();
            db.createIndex(collections.Users, {"createdAt": 1}, {expireAfterSeconds: 3600 }).then(function(){
                Model.update({_id : notifications.id}, 
                    {$push : {notifications: notifications.message}}
                );
            });
            
            return defer.promise;
        }, 
        GetAllNotifications: function(userId){
            var defer = q.defer();

                dao.get({ _id : new ObjectId(userId)}).then(function(users){
                    defer.resolve(users.notifications);
                }, function(err){
                    defer.reject(err);
                });
            
            return defer.promise;
        }, 
        DeleteNotification: function(userId, notificationId){
            var defer = q.defer();
            Model.update({_id : userId}, 
                {$pull: {notifications: {id: notifications}}});
            return defer.promise;
        },
        GetNotificationById: function(userId, notificationId){
            var defer = q.defer();
            Model.find({_id: userId, notifications.id: notificationId}).then(function(notifications){
                defer.resolve(notifications);
            });
            return defer.promise;
        } 

    };
};



module.exports = UserService;