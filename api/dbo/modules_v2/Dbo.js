var common = require('./Dbo.common');
var _ = require('underscore');
var q = require('q');

var Dbo = function(config){
    this.config = config;
};


/*
* config {
    collection -> Collection of this Dbo
    model      -> Model of this collection
  }
* */

// Basic get function, recives a where to query
Dbo.prototype.get = function(where, pageOptions){

    var self = this;

    return common.exec(function(db){
        var defer = q.defer();
        common.finder(db,self.config.collection,where,pageOptions)
            .then(function(results){
                defer.resolve(results);
            }, function(err){
                defer.reject(err);
            });

        return defer.promise;
    });
};

// Basic push function, recives an item to insert
Dbo.prototype.push = function(item){

    var self = this;
    var safeItem = common.secureCopyV2(self.config.model, item);
    console.log("Saving new item", safeItem);
    return common.exec(function(db){
        var defer = q.defer();

        common.inserter(db,self.config.collection,safeItem)
            .then(function(results){
               console.log('INSERTED ------ \n', self.config.collection)
                defer.resolve(results);
            }, function(err){
                defer.reject(err);
            });

        return defer.promise;
    });
};

// Basic update function, recives a where to query, and an item to insert
Dbo.prototype.update = function(where,item){

    var safeItem = common.secureCopyV2(this.config.model, item, true);
    var self = this;
    return common.exec(function(db){
        var defer = q.defer();

        common.updater(db,self.config.collection,where,{$set:safeItem})
            .then(function(results){
                defer.resolve(results);
            }, function(err){
                defer.reject(err);
            });

        return defer.promise;
    });
};

// Basic remove function, recives a where to query, and an item to insert
Dbo.prototype.remove = function(where){
    var self = this;
    return common.exec(function(db){
        var defer = q.defer();

        common.deleter(db,self.config.collection,where)
            .then(function(results){
                defer.resolve(results);
            }, function(err){
                defer.reject(err);
            });

        return defer.promise;
    });
};

module.exports = Dbo;