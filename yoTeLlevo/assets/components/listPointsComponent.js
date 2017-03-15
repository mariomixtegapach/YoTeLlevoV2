(function() { 
	 angular.module('yoTeLlevo')
		.component('listPointsComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/pointsList.html',
		    controller: 'listPointCtrl'
		})
		.controller('listPointCtrl',['$scope','$ionicLoading','$state',
									'$rootScope', listPointCtrl]);

	function listPointCtrl($scope,$ionicLoading, $state, $rootScope){
		
	}
})();