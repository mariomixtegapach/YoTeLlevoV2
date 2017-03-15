var http = require('http');
var q = require('q');

var gett = function(query) {
    var defer = q.defer();

    var options = {
        host: 'api.fixer.io',
        path: query
    };


    try {
      var  callback = function (response) {

            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                var statusCode = response.statusCode;
                try {
                    var resp = JSON.parse(str);
                    console.log("Fixer -----------------------------------------")
                    console.log(resp, statusCode);
                    if (resp.error || statusCode >= 400) {
                        defer.reject(new Error("Error in api fixer"));
                    } else {
                        defer.resolve(resp);
                    }
                } catch (ex) {
                    defer.reject(str);
                }
            });


        };

        http.request(options, callback).end();
    } catch(ex){
        defer.reject(ex);
    }

    return defer.promise;
};

module.exports = {
  Convert : function(from, to){
     return gett('/latest?base='+to+'&symbol='+from);
  },
  GetAll : function(){
      return gett('/latest');
  }
};