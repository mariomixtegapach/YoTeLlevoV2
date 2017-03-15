var Dao = require('../dbo/modules_v2/Dbo');
var common = require('../dbo/modules_v2/Dbo.common');
var Model = require('../models/Orders');
var collection = require('../dbo/collections');
var q = require('q');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');
var DishesService = require('../services_v2/Dishes')();
var UsersService  = require('../services_v2/Users')();
var PaymentService = require('../services_v2/Payment')();

var dao = null;



var OrdersService = function(config){
    dao = new Dao({
        model : Model,
        collection : collection.Orders
    });
    
    return {
        GetOrderById : function(orderId, ligth){
            var defer = q.defer();

            if(typeof orderId !== 'string') {
                defer.reject(new Error('orderId debe ser una cadena'));
            } else {
                dao.get({ _id : ObjectId(orderId)},{page:1, pageSize:10}).then(function(orders){
                    var promises = [];

                    if(!ligth) {
                        orders.result.forEach(function (order) {
                            order.products.forEach(function (product) {
                                var prom = DishesService.GetDishById(product.idProduct).then(function (dish) {
                                    product.product = dish.result[0];
                                }, function (err) {
                                    console.log('Error getting dish ' + (product.idProduct)
                                        + ' on order ' + orderId, err);
                                });
                                promises.push(prom);
                            });

                            promises.push(UsersService.GetUserById(order.userId).then(function (user) {
                                user = user[0];
                                delete user.password;
                                order.user = user;
                            }));
                            if (order.payed)
                                promises.push(PaymentService.GetPayment(orderId).then(function (payment) {
                                    order.payment = payment;
                                }));

                        });
                    }

                    q.allSettled(promises).then(function(){
                        defer.resolve(orders);
                    }, function(err){
                        console.log(err);
                        defer.reject(err);
                    });

                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;  
        },
        GetOrdersByUserId : function(userId, pageOptions){
             var defer = q.defer();
             var self = this;

             if(typeof userId !== 'string') {
                defer.reject(new Error('userId debe ser una cadena'));
             } else {
                dao.get({ userId : userId }, pageOptions).then(function(orders){
                    var proms = [];
                    orders.result.forEach(function(order){
                        proms.push(self.GetOrderById(order._id.toString()).then(function(oo){
                            order = oo[0];
                        }));
                    });

                    q.allSettled(proms).then(function(){
                        defer.resolve(orders);
                    });


                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;  
        },
        GetOrderByStatus : function(userId, status, pageOptions){
            var where = {};
            if(typeof userId == 'string'){
                where.userId = userId;
            }

            where.status = status;

            return dao.get(where,pageOptions);

        },
        GetOrdersDelivered: function(userId, pageOptions){
            var defer = q.defer();

            var self = this;
               this.GetOrderByStatus(userId,4,pageOptions).then(function(orders){
                    var promises = [];

                    orders.result.forEach(function(order){
                        promises.push(self.GetOrderById(order._id.toString()).then(function(oo){
                            order = oo;
                        }))
                    });

                    q.allSettled(promises).then(function(rrr){
                        orders.prod = rrr;
                        defer.resolve(orders);
                    }, function(err){
                        console.log(err);
                        defer.reject(err);
                    });
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });


            return defer.promise; 
        },
        GetOrdersReady: function(userId, pageOptions){
            var defer = q.defer();

            var self = this;
            this.GetOrderByStatus(userId,3,pageOptions).then(function(orders){
                var promises = [];

                orders.result.forEach(function(order){
                    promises.push(self.GetOrderById(order._id.toString()).then(function(oo){
                        order = oo;
                    }))
                });

                q.allSettled(promises).then(function(rrr){
                    orders.prod = rrr;
                    defer.resolve(orders);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }, function(err){
                console.log(err);
                defer.reject(err);
            });


            return defer.promise;
        },
        GetOrdersPreparing: function(userId, pageOptions){
            var defer = q.defer();

            var self = this;
            this.GetOrderByStatus(userId,2,pageOptions).then(function(orders){
                var promises = [];

                orders.result.forEach(function(order){
                    promises.push(self.GetOrderById(order._id.toString()).then(function(oo){
                        order = oo;
                    }))
                });

                q.allSettled(promises).then(function(rrr){
                    orders.prod = rrr;
                    defer.resolve(orders);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }, function(err){
                console.log(err);
                defer.reject(err);
            });


            return defer.promise;
        },
        GetOrdersPayed: function(userId, pageOptions){
            var defer = q.defer();

            var self = this;
            this.GetOrderByStatus(userId,1,pageOptions).then(function(orders){
                var promises = [];

                orders.result.forEach(function(order){
                    promises.push(self.GetOrderById(order._id.toString()).then(function(oo){
                        order = oo;
                    }))
                });

                q.allSettled(promises).then(function(rrr){
                    orders.prod = rrr;
                    defer.resolve(orders);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }, function(err){
                console.log(err);
                defer.reject(err);
            });


            return defer.promise;
        },
        AddProductToOrder: function(orderId, productsItem){
            var defer = q.defer();

            var handleError = function(err){
                console.log(err);
                defer.reject(err);
            };

            var self = this;

            self.GetOrderById(orderId, true).then(function(order){
                order = order[0];

                if(order){
                    _.each(productsItem, function(prod){
                        var index = _.findIndex(order.products,
                            {
                                idProduct : prod.idProduct
                            });

                        if(index !== -1){
                            order.products[index].count += prod.count;
                        } else {
                            order.products.push(prod);
                        }
                    });

                self.UpdateOrder(orderId,{ products: order.products}).then(function(){
                    defer.resolve(order);
                }, handleError);

                } else {
                    handleError(new Error('Order not found'));
                }
            }, handleError);


            return defer.promise;
        },
        DeleteProductOrder: function(orderId, productsItem){

            var defer = q.defer();

            var handleError = function(err){
                console.log(err);
                defer.reject(err);
            };

            var self = this;

            self.GetOrderById(orderId, true).then(function(order){
                order = order[0];

                if(order){
                    _.each(productsItem, function(prod){
                        var index = _.findIndex(order.products,
                            {
                                idProduct : prod.idProduct
                            });

                        if(index !== -1){
                            if(order.products[index].count - prod.count > 0){
                                order.products[index].count -= prod.count;
                            } else {
                                order.products.splice(index,1);
                            }
                        }

                    });

                    self.UpdateOrder(orderId,{ products: order.products}).then(function(){
                        defer.resolve(order);
                    }, handleError);

                } else {
                    handleError(new Error('Order not found'));
                }
            }, handleError);


            return defer.promise;

        },
        InsertOrder: function(itemOrder){
            var defer = q.defer();

                dao.push(itemOrder).then(function(order){
                    defer.resolve(order);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });


            return defer.promise;

        },
        UpdateOrder : function(idOrder, order){
            var defer = q.defer();

            if(typeof idOrder !== 'string') {
                defer.reject(new Error('idOrder debe ser una cadena'));
            } else {
                dao.update({_id: new ObjectId(idOrder)},order).then(function(dishes){
                    defer.resolve(dishes);
                }, function(err){
                    console.log(err);
                    defer.reject(err);
                });
            }

            return defer.promise;
        }
    };
};



module.exports = OrdersService;