(function() { 
	 angular.module('yoTeLlevo')
		.component('cardComponent',{
			 bindings: {
		       point: '='
		    },
		    templateUrl:'templates/elements/card/card-point.html',
		    controller: 'cardCtrl'
		})
		.controller('cardCtrl',['$scope','$ionicLoading','$state', cardCtrl]);

	function cardCtrl($scope,$ionicLoading, $state){
		$scope.point = $scope.$ctrl.point;
	}
})();