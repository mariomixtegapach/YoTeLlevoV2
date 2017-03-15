var Dao = require('../dbo/modules_v2/Dbo');
var SessionReq = require('../dbo/requests/Dbo.request.session');
var common = require('../dbo/modules_v2/Dbo.common');
var collections = require('../dbo/collections.json');
var q = require('q');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var dao = null;



var SessionService = function(config){
    dao = new Dao({
        model : {
            token : '',
            data: '',
            createdAt : new Date()
        },
        collection : collections.Session
    });

    return {
        CreateIndex : function(){
            var defer = q.defer();
            try {

                common.exec(function (db) {
                    var dd = q.defer();
                    db.createIndex(collections.Session, {"createdAt": 1}, {expireAfterSeconds: 3600 })
                        .then(function (done) {
                            console.log('Indice creado');
                            dd.resolve(done);
                        }, function (err) {
                            console.log(err);
                            dd.reject(err);
                        });

                    return dd.promise;
                }).then(function(ddone){
                   defer.resolve(ddone);
                }, function(err){
                    defer.reject(err);
                });

            } catch (ex){
                console.log(ex);
                defer.reject(ex);
            }

            return defer.promise;
        },
        Login : function(user, token){
            var defer = q.defer();

            if(typeof token !== 'string' ||  token === '' || !token){
                defer.reject(new Error('token debe ser string y no vacio'));
            } else {
                dao.push({
                    token : token.toString(),
                    data : JSON.stringify(user),
                    createdAt : new Date()
                }).then(function(done){
                    defer.resolve(done);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;
        },
        GetSession : function(token){
            var defer = q.defer();

            if(typeof token !== 'string' ||  token === ''){
                defer.reject(new Error('token debe ser string y no vacio'));
            } else {
                dao.get({token: token}).then(function(done){
                    done = done[0];
                    if(done && done.data) done.data = JSON.parse(done.data) ;
                    defer.resolve(done);
                }, function(err){
                    defer.reject(err);
                });
            }

            return defer.promise;
        },
        RevokeSession : function(token){
            var defer = q.defer();

            if(typeof token !== 'string' ||  token === ''){
                defer.reject(new Error('token debe ser string y no vacio'));
            } else {
                dao.remove({token:token}).then(function(done){
                    defer.resolve(done);
                }, function(err){
                    defer.reject(err);
                });
            }

            return defer.promise;
        },
        RenewSession : function(token){
            var defer = q.defer();

            if(typeof token !== 'string' ||  token === ''){
                defer.reject(new Error('token debe ser string y no vacio'));
            } else {
                dao.update({token:token},{
                    createdAt : new Date()
                }).then(function(done){
                    defer.resolve(done);
                }, function(err){
                    defer.reject(err);
                });
            }

            return defer.promise;
        }
    }
};



module.exports = SessionService;