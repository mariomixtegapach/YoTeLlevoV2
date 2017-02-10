(function() { 
	 angular.module('yoTeLlevo')
		.component('listRequestComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/requestList.html',
		    controller: 'dashboardCtrl'
		})
		.controller('listRequestCtrl',['$scope','$ionicLoading','$state', listRequestCtrl]);

	function listRequestCtrl($scope,$ionicLoading, $state){
		
	}
})();