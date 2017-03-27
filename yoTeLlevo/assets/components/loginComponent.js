(function() { 
	 angular.module('yoTeLlevo')
		.component('loginComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/login.html',
		    controller: 'loginCtrl'
		})
		.controller('loginCtrl',['$scope','$ionicLoading','$state','$apiClient','toast', loginCtrl]);


	function loginCtrl($scope,$ionicLoading, $state, $apiClient, toast){
		$scope.login = function login(){
			console.log(this.username, this.password);
			$state.go('dashboard');
			$scope.show();
			
			$apiClient.login(this.username, this.password).then(function(){
				console.log(arguments);
				//setTimeout(function(){
					$scope.hide();
					$state.go('dashboard');
				//}, 2000);
			}, function(err){
				$scope.hide();
				toast.show(err.data.message);
			})

			
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