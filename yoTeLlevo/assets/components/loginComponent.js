(function() { 
	 angular.module('yoTeLlevo')
		.component('loginComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/login.html',
		    controller: 'loginCtrl'
		})
		.controller('loginCtrl',['$scope','$ionicLoading','$state', loginCtrl]);


	function loginCtrl($scope,$ionicLoading, $state){
		$scope.login = function login(){
			console.log(this.username, this.password);

			$scope.show();
			
			setTimeout(function(){
				$scope.hide();
				$state.go('dashboard');
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