(function() { 
	 angular.module('yoTeLlevo')
		.component('dashboardComponent',{
			 bindings: {
		       
		    },
		    templateUrl:'templates/dashboard.html',
		    controller: 'dashboardCtrl'
		})
		.controller('dashboardCtrl',
			['$scope','$ionicLoading','$state',
			'$ionicTabsDelegate','$rootScope','$ionicModal','$timeout','$apiClient','toast','$interval',  dashboardCtrl]);

	function dashboardCtrl($scope,$ionicLoading, $state ,
		                   $ionicTabsDelegate, $root, $ionicModal, $timeout,$apiClient,toast,$interval ){

		var checkNotifications = $interval(function(){
			$apiClient.checkNotifications().then(function(notifications){
				if(notifications){
					for(var in = 0; i < notifications.lenght; in++){
						$apiClient.sendNotification(notifications[in]);
					}
				}
			});
		}, 3000 );

		
		$root.sessionStarted = true;
		$scope.points = [];
		$scope.tabs = {
			tabIndex : false
		}
		

		$scope.cleanMapVariables = function(){
			$scope.encodedRoute = '';
			$scope.searchs = {
				destination : '',
				origin : ''
			}
			$scope.markers = null;
			$scope.destinationResults = null;
			$scope.originResults = null;
			 $scope.destinationPlace = null;
			 $scope.originPlace = null;
		}
		
		
		if(!$root.sessionStarted){
			$state.go('login');
		}

		$scope.logout = function logout(){
			$interval.cancel(checkNotifications);
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

		$scope.tabChange = function(){ };

		$scope.fabOnClick = function(){
			$scope.tabs.tabIndex ? newPoint() : newRoute();
		}

		$scope.closeModal = function() {
		    $scope.modal.hide();
		    $scope.modal && $scope.modal.remove();
		};

		$scope.$on('$destroy', function() {
	    	$scope.modal && $scope.modal.remove();
	    });

		function openModal(url){
			$scope.cleanMapVariables();
			$ionicModal.fromTemplateUrl(url, {
			    scope: $scope,
			    animation: 'slide-in-up'
			}).then(function(modal) {
			    $scope.modal = modal;
			    $scope.modal.show();
			});
		}

		function newRoute(){
			openModal('templates/modals/addNewRoute.html');		  
		}

		function newPoint(){
			openModal('templates/modals/addNewPoint.html');		  
		}


		$scope.$watch('searchs', function(newVal,oldValue){				
				if(newVal && newVal.origin && newVal.origin !== oldValue.origin && $scope.takeOrigin){
					$scope.originLoading = true;
					$scope.searchs.originValue = newVal.origin;
				} else {
					//$scope.originLoading = false;
					$scope.takeOrigin = true;
				}

				if(newVal && newVal.destination && newVal.destination != oldValue.destination && $scope.takeDest){
					$scope.destinationLoading = true;
					$scope.searchs.destinationValue = newVal.destination; 
				}  else {
					//$scope.destinationLoading = false;
					$scope.takeDest = true;
				}
		}, true);

		$scope.$watch('encodedRoute', function(newval, oldval){
			console.log("jpjpojpojpojpojpojpojojojpjpp",newval, oldval)
		},true)

		$scope.$watch('tabs', function(newVal, oldVal){
			if(newVal.tabIndex){
				$apiClient.getPoints().then(function(points){
					console.log(points);
					$scope.points = points.result;
				})
			} else {

				
			}
		}, true);

		$scope.createOrigin= function(res){
			$scope.destinationResults = null;
			$scope.originResults = res;
			$scope.originLoading = false;
			$scope.$apply();
		}

		$scope.createDestination= function(res){
			$scope.originResults = null;
			$scope.destinationResults = res;
			$scope.destinationLoading = false;
			$scope.$apply();
		}

		$scope.addMarkerFirst = function(item,isOrigin){
			if(!($scope.originPlace && $scope.destinationPlace)){
				$scope.markers = item;
			} else {
				$scope.markers = null;
			}

			$scope.destinationResults = null;
			$scope.originResults = null;
			

			if(isOrigin){
				$scope.takeOrigin = false;
				$scope.searchs.origin = item.name;
				$scope.originPlace = item;
			} else {
				$scope.takeDest = false;
				$scope.searchs.destination = item.name;
		        $scope.destinationPlace = item;
			}
		}

		$scope.onRoute = function(route){
			$scope.encodedRoute = route.routes[0].overview_polyline;
			$scope.$apply();
		};

		//TODO: Save in db
		$scope.saveRoute = function(){
			$scope.show();
			$timeout(function(){
				$scope.closeModal();
				$scope.hide();
			}, 1000)
		}
		
		//TODO: Save in db
		$scope.savePoint = function(){
			$scope.show();

			console.log($scope.originPlace)

			var tmpPoint = {
				lat : $scope.originPlace.geometry.location.lat(),
				lng : $scope.originPlace.geometry.location.lng(),
				name : $scope.originPlace.name,
				icon : $scope.originPlace.icon,
				formattedAddress:$scope.originPlace.formatted_address
			}

			$apiClient.savePoint(tmpPoint).then(function(pp){
				console.log(pp);
				toast.show("Punto guardado!");
				$scope.cleanMapVariables();
				$scope.closeModal();
				$scope.hide();
			}, function(err){
				toast.show("Algo salio mal: "+err.message);
			})



			/*$timeout(function(){
				$scope.closeModal();
				$scope.hide();
			}, 1000)*/	
		}

		


	}
})();