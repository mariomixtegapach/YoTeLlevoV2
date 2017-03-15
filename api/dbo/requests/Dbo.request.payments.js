var PaymentRequest = function(){
    this.orderId = null;
    this.paymentType = null;
    this.rangeDate = {
        start: null,
        end: null
    };
};

/*
 {
     "idOrder":"",
     "paymentType":0,
     "date":"date"

 }
 */

module.exports = PaymentRequest;