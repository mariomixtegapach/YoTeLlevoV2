(function() { 
	 angular.module('yoTeLlevo')
		.component('listPointsComponent',{
			 bindings: {
		       points: '='
		    },
		    templateUrl:'templates/pointsList.html',
		    controller: 'listPointCtrl'
		})
		.controller('listPointCtrl',['$scope','$ionicLoading','$state',
									'$rootScope', listPointCtrl]);

	function listPointCtrl($scope,$ionicLoading, $state, $rootScope){
		$scope.points = $scope.$ctrl.points;
		$scope.$watch('$ctrl.points', function(newVal){
			$scope.points = newVal;
		});
	}
})();