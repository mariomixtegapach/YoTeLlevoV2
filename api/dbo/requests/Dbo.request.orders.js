
var OrdersRequest = function(){
    this.id = null;
    this.userId = null;
    this.dishes = null;
    this.readyToDelivery = null;
    this.finished = null;
    
    this.dateRangeOrdered = {
        start : null,
        end  : null
    };
    
    this.dateRangePayed = {
        start : null,
        end  : null
    };
    
    this.pageOptions = {
        page : 1,
        pageSize: 10
    };
    this.toUpdate = null;
    
    this.orders = {
        isAdd : null,
        products: null
    };

    this.toUpdate = null;

};

module.exports = OrdersRequest;


