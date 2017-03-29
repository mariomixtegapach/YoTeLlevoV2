(function() { 
	 angular.module('yoTeLlevo')
		.component('listRoutesComponent',{
			 bindings: {
		       routes:'='
		    },
		    templateUrl:'templates/routeList.html',
		    controller: 'listRoutesCtrl'
		})
		.controller('listRoutesCtrl',['$scope','$ionicLoading','$state', listRoutesCtrl]);

	function listRoutesCtrl($scope,$ionicLoading, $state){
		$scope.routes = $scope.$ctrl.routes;
		$scope.$watch('$ctrl.routes', function(newVal){
			$scope.routes = newVal;
			console.log(newVal)
		});
	}
})();