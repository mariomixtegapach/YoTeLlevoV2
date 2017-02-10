(function() { 
	 angular.module('yoTeLlevo')
		.component('dashboardComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/dashboard.html',
		    controller: 'dashboardCtrl'
		})
		.controller('dashboardCtrl',['$scope','$ionicLoading','$state', dashboardCtrl]);

	function dashboardCtrl($scope,$ionicLoading, $state){
		$scope.logout = function logout(){
			
			$scope.show();
			
			setTimeout(function(){
				$scope.hide();
				$state.go('login');
			}, 2000);
		}

		$scope.show = function() {
		   $ionicLoading.show({
		     template: 'Loading...',
		     duration: 3000
		   }).then(function(){
		      console.log("The loading indicator is now displayed");
		   });
		};

		$scope.hide = function(){
		  $ionicLoading.hide().then(function(){
		     console.log("The loading indicator is now hidden");
		  });
		};
	}
})();