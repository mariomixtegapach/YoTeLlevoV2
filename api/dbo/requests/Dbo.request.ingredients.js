var IngredientsRequest = function(){
    this.id = null;
    this.query = null;
    this.pageOptions = {
        page : 1,
        pageSize: 10
    };
    this.toUpdate = null;
};

module.exports = IngredientsRequest;