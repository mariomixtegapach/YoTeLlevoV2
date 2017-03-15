var MongoClient = require('mongodb').MongoClient;
var common = require('./modules/Dbo.common');
var _config;

var Dbo = function(config, overrides){
    this.config = config;
    this.overrides = overrides;
    _config = config;

    Dbo.prototype.Dishes          = require('./modules/Dbo.dishes')(_config, overrides);
    Dbo.prototype.Ingredients     = require('./modules/Dbo.Ingredients')(_config, overrides);
    Dbo.prototype.Users           = require('./modules/Dbo.users')(_config, overrides);
    Dbo.prototype.Rates           = require('./modules/Dbo.rates')(_config, overrides);
    Dbo.prototype.Comments        = require('./modules/Dbo.comments')(_config, overrides);
    Dbo.prototype.Orders          = require('./modules/Dbo.orders')(_config, overrides);
    Dbo.prototype.Cards           = require('./modules/Dbo.cards')(_config, overrides);
    Dbo.prototype.Payments        = require('./modules/Dbo.payments')(_config, overrides);
    Dbo.prototype.Sessions        = require('./modules/Dbo.sessions')(_config, overrides);
    Dbo.prototype.Categories      = require('./modules/Dbo.categories')(_config, overrides);
    
};

module.exports = Dbo;