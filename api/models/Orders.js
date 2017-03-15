var model = function () {
   return {
       "userId":"",
       "products":[{
           "idDish"    : "",
           "idProduct" : "",
           "count"     : 2
       }],
       "promotions":["4as54das5das5da"], //<-- Ids promotions
       "charge":0,
       "status": 0,
       "dateOrdered": new Date(),
       "datePayed": new Date(),
       "dateAuthorized": new Date(),
       "dateDelivered": new Date()
   }
};

module.exports = model();