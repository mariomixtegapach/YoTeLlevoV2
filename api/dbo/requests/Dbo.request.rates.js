var RatesRequest = function(){
    this._id = null;
    this.userId = null;
    this.dishId = null;
    this.pageOptions = {
        page: 1,
        pageSize: 10
    },
    this.toUpdate = null;
};

module.exports = RatesRequest;