var DishesRequest = function(){
    this.id = null;
    this.query = null;
    this.exatcPrice = null;
    this.lowerPriceThan = null;
    this.higerPriceThan = null;
    this.ingredients = null;
    this.category = null;
    this.pageOptions = {
        page : 1,
        pageSize: 10
    };
    this.toUpdate = null;
};

module.exports = DishesRequest;