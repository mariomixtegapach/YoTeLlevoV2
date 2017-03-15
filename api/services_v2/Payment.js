var Dao = require('../dbo/modules_v2/Dbo');
var PayReq = require('../dbo/requests/Dbo.request.cards.js');
var Pay_Req = require('../dbo/requests/Dbo.request.payments.js');
var PayModel = require('../models/Payment');
var CardModel = require('../models/Card');
var common = require('../dbo/modules_v2/Dbo.common');
var UsersService = require('../services_v2/Users')();
var Fixer = require('./../modules/fixer');
var collection = require('../dbo/collections');

var paypal = require('paypal-rest-sdk');
var config = require('../config.json');
paypal.configure(config.paypalApi);

var q = require('q');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var dao = null;
var daoCards = null;


var PaymentService = function(){
    dao = new Dao({
        model: PayModel,
        collection: collection.Payments
    });

    daoCards = new Dao({
        model: CardModel,
        collection: collection.Cards
    });

    return {
        GetCreditCard: function(idCreditCard){
            return daoCards.get({_id : new ObjectId(idCreditCard)});
        },
        GetCreditCards: function(userId, pageOptions){
            return daoCards.get({userId : userId}, pageOptions);
        },
        UpdateCreditCard : function(userId, idCreditCard, hash){
            return daoCards.update({userId:userId, _id:new ObjectId(idCreditCard)},{cc : hash});
        },
        RemoveCreditCard: function(userId, idCreditCard){
            return daoCards.remove({userId:userId, _id:new ObjectId(idCreditCard)});
        },
        AddCreditCard : function(userId, hash){

            var defer = q.defer();

            if(!typeof userId === 'string' || !typeof hash === 'string'){
                defer.reject(new Error('Invalid request'));
            } else {
                daoCards.push({userId: userId, cc: hash}).then(function(card){
                    defer.resolve(card);
                }, function(err){
                    defer.reject(err);
                });
            }

            return defer.promise;
        },
        AddNewPayment : function(paymentItem){
            var defer = q.defer();

            paymentItem.date = new Date();

            dao.push(paymentItem).then(function(payment){
                defer.resolve(payment);
            }, function(err){
                defer.reject(err);
            });

            return defer.promise;

        },
        PayCreditCard : function(card, userId, amount, description){

            var defer = q.defer();

            var handleError = function(err){
                console.log(err);
                defer.reject(err);
            };



            Fixer.Convert('MXN','USD').then(function(resss){
                console.log("Paying amount MXN: ",amount, "\nPaying amount USD:", amount/resss.rates.MXN);
                amount = amount/resss.rates.MXN;
                UsersService.GetUserById(userId).then(function(users){
                         var user = users[0];
                         if(user){
                             var paymentObj = {
                                 "intent": "sale",
                                 "payer": {
                                 "payment_method": "credit_card",
                                     "funding_instruments": [{
                                         "credit_card": {
                                             "number": card.number,
                                             "type": card.type,
                                             "expire_month": card.expire_month,
                                             "expire_year": card.expire_year,
                                             "cvv2": card.cvv2,
                                             "first_name": user.name,
                                             "last_name": user.lastname
                                         }
                                     }]
                                 },
                                 "transactions": [{
                                     "amount": {
                                         "total": (+amount).toFixed(2),
                                         "currency": "USD"
                                     },
                                    "description": description
                                 }]
                             };

                             paypal.payment.create(paymentObj, function (error, payment) {
                                 if (error) {
                                    handleError(error);
                                 } else {
                                     paypal.sale.get(payment.transactions[0].related_resources[0].sale.id, function (error, sale) {
                                         if (error) {
                                            handleError(error);
                                         } else {
                                             console.log("Get Sale Details Response");
                                             console.log(JSON.stringify(sale));
                                             defer.resolve(sale);
                                         }

                                    });
                                 }
                             });
                         } else {
                            handleError(new Error("User not found"));
                         }
                     }, handleError);
            }, handleError);

            return defer.promise;
        },
        GetPayment : function(orderId){
            return dao.get({orderId : orderId});
        }
    };
};



module.exports = PaymentService;