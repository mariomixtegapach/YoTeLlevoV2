(function() { 
	 angular.module('yoTeLlevo')
		.component('cardComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/elements/card/card.html',
		    controller: 'cardCtrl'
		})
		.controller('cardCtrl',['$scope','$ionicLoading','$state', cardCtrl]);

	function cardCtrl($scope,$ionicLoading, $state){
		
	}
})();