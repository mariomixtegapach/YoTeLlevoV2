(function() { 
	 angular.module('yoTeLlevo')
		.component('registerComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/register.html',
		    controller: 'registerCtrl'
		})
		.controller('registerCtrl',['$scope','$ionicLoading','$state', registerCtrl]);

	function registerCtrl($scope,$ionicLoading, $state){

		$scope.user = {};

		$scope.register = function register(){
			console.log($scope, $scope.user);
		}
	}
})();