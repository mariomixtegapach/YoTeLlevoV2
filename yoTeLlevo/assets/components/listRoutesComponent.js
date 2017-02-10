(function() { 
	 angular.module('yoTeLlevo')
		.component('listRoutesComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/routeList.html',
		    controller: 'listRoutesCtrl'
		})
		.controller('listRoutesCtrl',['$scope','$ionicLoading','$state', listRoutesCtrl]);

	function listRoutesCtrl($scope,$ionicLoading, $state){
		
	}
})();