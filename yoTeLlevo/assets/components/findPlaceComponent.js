(function() { 
	 angular.module('yoTeLlevo')
		.component('findPlaceComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/elements/findPlace.html',
		    controller: 'findPlaceCtrl'
		})
		.controller('findPlaceCtrl',['$scope','$ionicLoading','$state', findPlaceCtrl]);

	function findPlaceCtrl($scope,$ionicLoading, $state){
		$scope.logResults= function(res){
			$scope.results = res;
		}

		$scope.itemSelected = function(item){
			$scope.marker = item;
			$scope.results = null;
		}
	}
})();