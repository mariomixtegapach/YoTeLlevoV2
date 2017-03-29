(function() { 
	 angular.module('yoTeLlevo')
		.component('cardRouteComponent',{
			 bindings: {
		       route: '='
		    },
		    templateUrl:'templates/elements/card/card.html',
		    controller: 'cardRouteCtrl'
		})
		.controller('cardRouteCtrl',['$scope','$ionicLoading','$state', cardRouteCtrl]);

	function cardRouteCtrl($scope,$ionicLoading, $state){
		$scope.route = $scope.$ctrl.route;
	}
})();
