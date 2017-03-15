var CommentsRequest = function(){
    this.id = null;
    this.userId = null;
    this.dishId = null;
    this.query = null;
    this.pageOptions = {
        page : 1,
        pageSize: 10
    };
};

module.exports = CommentsRequest;
