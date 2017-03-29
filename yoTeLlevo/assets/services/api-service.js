(function() { 
	 angular.module('yoTeLlevo')
		.service('$apiClient',['$http','$q',apiClientController]);

	function apiClientController($http, $q){
		var baseUri = 'http://yotellevo-chatapi.rhcloud.com';

		var getHashFromLocal = function(){
			return localStorage.getItem('yotellevoApi');
		}

		var getHeaders = function(){
			return {
					Authorization :"Basic dXNlcnlvdGVsbGV2bzp5b3RlbGxldm8=",
				    'Content-Type':'application/json'
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
			return $http.put(baseUri + uri, JSON.stringify(data), {
				headers : getHeaders()
			})
		}

		var post = function(uri, data){
			return $http.post(baseUri + uri, JSON.stringify(data), {
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

		this.getLocalUser = function(){

			var userString  = localStorage.getItem('ytllocaluser');
			return userString ? JSON.parse(userString) : null;
		}

		this.login = function(username, pass){
			var defer = $q.defer();
			proc('/login',{username : username, password: pass}, get).then(function(data){
				localStorage.setItem('ytllocaluser',JSON.stringify(data.user));
				defer.resolve(data)
			}, defer.reject);
			return defer.promise;
		}

		this.register = function(user){
			return proc('/users',user, put);	
		}

		this.checkUsername = function(username){
			return proc('/users/checkUsername/'+username,{}, get);	
		}


		/*- - -- - - Points - - - - - - */

		this.savePoint = function(point){

			var user = this.getLocalUser();
			point.userId = user._id.toString();

			return proc('/addPoint', {point:point}, put);
		}

		this.deletePoint = function(idPoint){
			return proc('/deletePoint', {idPoint: idPoint}, deletes);
		}

		this.getPoints = function(page){
			var user = this.getLocalUser();
			console.log(user._id.toString())
			return proc('/getPoints', {idUser: user._id.toString(), page: page}, get);	
		}
		/*- - -- - - Points - - - - - - */

		this.checkNotifications = function(){
			return proc('/users/notifications',{},get);
		}

		this.sendNotification = function(notificationMessage){
			var body = {};
			body.tokens = [localStorage.getItem('pushToken')];
			body.profile = "";
			body.notification = {
				"message": notificationMessage
			}

			return proc('https://api.ionic.io/push/notifications', body, post);
		}


	}
	
})();