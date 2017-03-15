var q = require('q');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var gConfig = require('./dbo-config.json');
var _ = require('underscore');

var common = {};
var tried = false;
var globaldb = null;

common.inserter = function(db,collection,item){
    var defer = q.defer();
    item._id = new ObjectId();
    db.collection(collection).insertOne(item).then(function(done){
        defer.resolve(done);
    }, function(err){
        defer.reject(err);
    });

    return defer.promise;
};

common.updater = function(db,collection,query, item, options){
    //console.log('Updating into',collection,query);
  return db.collection(collection).update(query, item,

      options || {
          "multi" : false,  // update only one document
          "upsert" : false  // insert a new document, if no existing document match the query
      }
  );
};

common.deleter = function(db, collection, where, options){
    //console.log('Deleting from',collection, where);
    var opts ={
        justOne: true
    };

    if(options && typeof options.justOne == 'boolean'){
        opts.justOne = options.justOne;
    }

    return db.collection(collection).remove(where, opts);
};

common.paginate = function(org,pageOption){
    var a = (pageOption.page - 1)*pageOption.pageSize;
    var b = a + pageOption.pageSize;
    return org.slice(a,b);
};

common.finder = function(db,collection,where,pageOption){
    var defer = q.defer();

   var rawRes = db.collection(collection).find(where);
     

    if(pageOption && pageOption.page && pageOption.pageSize){
        rawRes = rawRes.skip((pageOption.page-1)*pageOption.pageSize).limit(pageOption.pageSize);
    }

    rawRes.toArray(function(err,res){
       if(err){
           defer.reject(err);
       }  else {
           if(pageOption && pageOption.page && pageOption.pageSize) {
               db.collection(collection).count(where.$query ? where.$query:where, function (err, count) {
                   if(err){
                       console.log('ON FINDER: ', err, '\n\n');
                   }


                   defer.resolve({result: res, paginationOption:{
                       page : pageOption.page,
                       pageSize :pageOption.pageSize,
                       total:count
                   }});
               });
           } else {
               defer.resolve(res);
           }
       }
    });


    return defer.promise;
};

common.globalCollection = function(url,force){
    var defer = q.defer();
   // if(globaldb === null) {
        MongoClient.connect(process.env.OPENSHIFT_MONGODB_DB_URL || url || gConfig.url, function (err, db) {
            if (err) {
                defer.reject(err);
            } else {
     //           globaldb = db;
                defer.resolve(db);
            }
        });
   /* } else {
        defer.resolve(globaldb);
    }*/

    return defer.promise;
};

common.exec = function(func){
    var defer = q.defer();

    if(typeof func == 'function'){

        this.globalCollection().then(function(db){
           func(db).then(function(res){
              db.close();
              defer.resolve(res);
           }, function(err){
               db.close();
               defer.reject(err);
           });
        });
    } else {
        console.log(func, "is not a promise");
        defer.reject(new Error("Type error"));
    }

    return defer.promise;
};

common.secureCopy = function(model, obj){
    var processProperty = function(mod, orig, newObj){
        console.log(mod, orig, newObj)
        for(var k in orig){
           if(Array.isArray(orig[k]) && Array.isArray(mod[k])){
                newObj[k] = [];
                //console.log(mod[k])
                orig[k].forEach(function(item){

                    newObj[k].push(processProperty(mod[k][0],item, {}));
                });
            } else if(typeof orig[k] == 'object' && typeof mod[k] == 'object' && !Array.isArray(orig[k]) && !Array.isArray(mod[k])){
               if(orig[k].constructor.name === 'Object'){
                   newObj[k] = {};
                   processProperty(mod[k],orig[k], newObj[k]);
               } else {
                   newObj[k] = orig[k];
               }
            } else {
                if(typeof orig[k] === typeof mod[k]){
                    newObj[k] = orig[k];
                } else if(typeof orig[k] === 'object' && mod[k] === orig[k].constructor.name){
                    newObj[k] = orig[k];
                }
            }
        }

        return newObj;
    };



    //var newObjReturned = processProperty(model,obj, {});

    return processProperty(model,obj, {});
};

common.secureCopyV2 = function(model, obj, forceIncomplete){
    var nnew = _.pick(obj, _.allKeys(model));

    var self = this;
    for(var k in model) {
        if (_.isArray(model[k]) && _.isArray(obj[k])) {
            nnew[k] = [];
            obj[k].forEach(function (item) {
                nnew[k].push(self.secureCopyV2(model[k],item));
            });
        } else if(_.isObject(model[k]) && _.isObject(obj[k])){
            nnew[k] = model[k] instanceof Date && obj[k] instanceof Date ? obj[k]  :  self.secureCopyV2(model[k], obj[k]);
        } else if(typeof model[k] == typeof obj[k]){

            if(!obj[k]){
                if(!forceIncomplete) nnew[k] = model[k];
            } else {
                nnew[k] = obj[k];
            }


        } else {
            if(!obj[k]){
                if(!forceIncomplete) nnew[k] = model[k];
            } else {
                nnew[k] = obj[k];
            }
        }
    }

    return nnew;

};

common.required = function(obj, required){
    for(var i = 0; i< required.length;i++){
        var k = required[i];
        if(typeof obj[k] === 'undefined'){
            console.log(k + ' = ', obj[k]);
            return false;
        }

        if(obj[k] === null || obj[k] === ''){
            console.log(k + ' = ', obj[k],'Second if');
            return false;
        }
    }

    return true;
};

module.exports = common;