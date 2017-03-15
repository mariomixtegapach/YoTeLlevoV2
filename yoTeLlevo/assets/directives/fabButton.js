(function() { 
	 angular.module('yoTeLlevo')
		.directive('fabButton', ['$interval', 'dateFilter', function($interval, dateFilter) {
			  function link(scope, element, attrs) {
			  	scope.iconClass = "ion-android-add";
			  }

			  return {
			  	link: link,
			    templateUrl:'templates/directives/fabButton.html'
			  };
		}]);
})();