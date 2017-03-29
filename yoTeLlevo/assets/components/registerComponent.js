(function() { 
	 angular.module('yoTeLlevo')
		.component('registerComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/register.html',
		    controller: 'registerCtrl'
		})
		.controller('registerCtrl',['$scope','$ionicLoading','$state','$apiClient','toast', registerCtrl]);

	function registerCtrl($scope,$ionicLoading, $state, $apiClient, toast){

		$scope.user = {userType:0};

		$scope.register = function register(){
			if($scope.user.username) { 
				$apiClient.checkUsername($scope.user.username).then(function(res){
					if(res.usernameValid){

						var keys = ["userType", "name", "lastname", "username", "password"];
						var valid = 1;
						for(var i = 0; i < keys.length; i++){
							console.log(valid,$scope.user[keys[i]] , $scope.user[keys[i]] != -1 , $scope.user[keys[i]] !== '')
							valid &= typeof $scope.user[keys[i]] != 'undefined' && $scope.user[keys[i]] != -1 && $scope.user[keys[i]] !== '';

						}

						if(valid){
							$apiClient.register($scope.user).then(function(){
								toast.show("Usuario regisrado");
								$state.go('login');
							}, function(err){
								toast.show("Algo salio mal: "+err.message);
							})
						} else {
							toast.show("Revisa que los campos sean validos");
						}


					} else {
						toast.show("Username existente, escoge otro");
					}
				}, function(err){
					toast.show(err.data.message);
				})
			} else {
				toast.show("Username invalido");
			}
		}
	}
})();