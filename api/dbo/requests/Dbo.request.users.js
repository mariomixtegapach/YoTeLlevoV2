var UsersRequest = function(){
    this._id = null;
    this.query = null;
    this.username = null;
    this.login = {
        password: null,
        username: null
    };
    this.userType = null;
    
    this.credit = null;
    this.pageOptions = {
        page : 1,
        pageSize: 10
    };

    this.userToUpdate = null;
};

module.exports = UsersRequest;