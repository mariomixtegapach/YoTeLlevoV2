(function() { 
	 angular.module('yoTeLlevo')
		.service('$apiClient',['$http','$q',apiClientController]);

	function apiClientController($http, $q){
		var baseUri = '/api';

		var getHashFromLocal = function(){
			return localStorage.getItem('yotellevoApi');
		}

		var getHeaders = function(){
			return {
					Authorization :"Basic dXNlcnlvdGVsbGV2bzp5b3RlbGxldm8=",
				    'Content-Type':'text/plain'
				};
		}

		var get = function(uri, data){

			var query = '?';
			for(var key in data){
				query += key + '=' + data[key] + '&';
			}

			query += 'token='+getHashFromLocal();

			return $http.get(baseUri + uri + query, {
				headers : getHeaders()
			});
		}

		var put = function(uri, data){
			return $http.put(baseUri + uri, data, {
				headers : getHeaders()
			})
		}

		var deletes = function(uri, data){
			return $http.delete(baseUri + uri, data, {
				headers : getHeaders()
			});
		}

		var patch = function(uri, data){
			return $http.patch(baseUri + uri, data, {
				headers : getHeaders()
			});
		}

		var proc = function(uri,data, method){
			var defer = $q.defer();
			method(uri, data).then(function(res){
				defer.resolve(res.data);
			}, defer.reject);

			return defer.promise;
		}

		this.login = function(username, pass){
			return proc('/login',{username : username, password: pass}, get);
		}

		this.checkNotifications = function(){
			return get('/users/notifications');
		}

		this.sendNotification = function(notificationMessage){
			body = {};
			body.tokens = [localStorage.getItem('pushToken')];
			body.profile = "";
			body.notification = {
				"message": notificationMessage
			}

			return $http.post('https://api.ionic.io/push/notifications', body);
		}

	}
	
})();