var q = require('q');
var _ = require('underscore');
var common = require('./Dbo.common');
var collections = require('../collections');

var dbo = function(getWhereObject, collection, overrides, config){

    return {
        get    : overrides && overrides.get    ? overrides.get(getWhereObject, collection, config)    :  function (req) {

            var where = getWhereObject(req);
            var _db = null;
           
            var defer = q.defer();

            var handleError = function (err) {
                if(_db) _db.close();
                defer.reject(err);
            };


            common.globalCollection(config.mongoUrl, false).then(function (db) {
                _db = db;
                common.finder(db, collection, where.$or && where.$or.length ? where : where, req.pageOptions)
                    .then(function (dishes) {
                        if(_db) _db.close();
                        defer.resolve(dishes);
                    }, handleError);
            }, handleError);

            return defer.promise;
        },
        remove : overrides && overrides.remove ? overrides.remove(getWhereObject, collection, config) :  function (req) {
            var where = getWhereObject(req);
            var _db = null;

            var defer = q.defer();

            var handleError = function (err) {
                if(_db) _db.close();
                defer.reject(err);
            };


            common.globalCollection().then(function (db) {
                _db = db;
                common.deleter(db, collection, where).then(function (done) {
                    if(_db) _db.close();
                    defer.resolve(done);
                }, handleError);
            }, handleError);

            return defer.promise;
        },
        update : overrides && overrides.update ? overrides.update(getWhereObject, collection, config) :  function (req) {
            var where = getWhereObject(req);

            var _db = null;

            var defer = q.defer();

            var handleError = function (err) {
                if(_db) _db.close();
                defer.reject(err);
            };

            if (req.toUpdate) {
               // console.log({$set : req.toUpdate})
                common.globalCollection().then(function (db) {
                    _db = db;
                    common.updater(db, collection, where,{$set : req.toUpdate}).then(function (done) {
                        defer.resolve({updated: true, updateInfo: done});
                        if(_db) _db.close();
                    }, handleError);
                }, handleError);
            } else {
                defer.resolve({updated: false, updateInfo: null});
            }

            return defer.promise;
        },
        push   : overrides && overrides.push   ? overrides.push(getWhereObject, collection, config)   :  function (item) {
            var _db = null;

            var defer = q.defer();

            var handleError = function (err) {
                if(_db) _db.close();
                defer.reject(err);
            };

            common.globalCollection(config.mongoUrl).then(function (db) {
                _db = db;
                common.inserter(db, collection, item).then(function (done) {
                    defer.resolve(done);
                    if(_db) _db.close();
                }, handleError);
            }, handleError);

            return defer.promise;
        }
    };
};


module.exports = dbo;