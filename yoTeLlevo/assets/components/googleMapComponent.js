(function() { 
	 angular.module('yoTeLlevo')
		.component('googleMapComponent',{
			 bindings: {
		       search   : '=',
		       onSearch : '&',
		       marker   : '=',
		       idMap    : '=',
		       //Start Cosas de rutas
		       origin 				: "=",
		       destination 	    	: "=",
		       onOriginSearch 		: "&",
		       onDestinationSearch  : "&",
		       onRoute				: "&",
		       originPlace 			: '=',
		       destinationPlace 	: '='
		       //End cosas de rutas
		    },
		    templateUrl:'templates/elements/googleMaps/googleMap.html',
		    controller: 'googleMapCtrl'
		})
		.controller('googleMapCtrl',['$scope','$ionicLoading','$state','$timeout', googleMapCtrl]);

	function googleMapCtrl($scope,$ionicLoading, $state, $timeout){

		var markers = [];
		$scope.encodedRoute = '';
		function clearMarkers(){
			markers.forEach(function(marker){
				if(marker){
		        	marker.setMap(null);
		        	marker = null;
		        }
			});

			markers = [];
		}

		function callback(results, status) {
	        if (status === google.maps.places.PlacesServiceStatus.OK) {
	        	clearMarkers();
	         	$scope.$ctrl.onSearch({results:results});
	        }
	    }

	    function createMarker(place, setCenter, draggable) {
	    	console.log(place)
	        var placeLoc = place.geometry ? place.geometry.location: place;

	        
	        var marker = new google.maps.Marker({
	           map: $scope.map,
	           position: placeLoc,
	           icon:'img/icon-place.png',
	           draggable: draggable,
	           animation: google.maps.Animation.DROP
	        });

	        markers.push(marker);
 			console.log(marker)
	        google.maps.event.addListener(marker, 'click', function() {
	          infowindow.setContent(place.name);
	          infowindow.open($scope.map, this);
	        });

	        google.maps.event.addListener(marker, 'dragend', function(location) {
	          if(markers.length == 2){

					  var request = {
					    origin:markers[0].position,
					    destination:markers[1].position,
					    travelMode: google.maps.TravelMode.DRIVING
					  };

					  directions.route(request, function(result, status) {
					    if (status == google.maps.DirectionsStatus.OK) {
					      directionsDisplay.setDirections(result);
					       var leg = result.routes[ 0 ].legs[ 0 ];
					       // clearMarkers();
					      //  createMarker( leg.start_location, false, true );
	  				//		createMarker( leg.end_location, false, true );
	  						console.log(leg)
					    }
					  });
	    		}
	        });

	        if(setCenter)
	        	$scope.map.setCenter(placeLoc);

	        console.log(place)
	    }

	    $timeout(function(){
	    	$scope.map = new google.maps.Map(document.getElementById($scope.$ctrl.idMap || 'map'), {
		          center: {lat:21.1742900, lng: -86.8465600},
		          scrollwheel: true,
		          zoom: 12,
		          disableDefaultUI: true
	        });

	        service = new google.maps.places.PlacesService($scope.map);
	        directions  = new google.maps.DirectionsService();
	        
	        directionsDisplay = new google.maps.DirectionsRenderer({
	        	 draggable: true,
	        	 map:$scope.map,
	        	 suppressMarkers: true
	        });
	        
	    }, 2000);

		

		$scope.marker = null;

		$scope.$watch('$ctrl.search', function(newVal,pastVal){
    		var request = {
			    location: {lat:21.1742900, lng: -86.8465600},
			    radius: '500',
			    query: newVal
			};

			if(newVal)
    			service.textSearch(request, callback);		
    	}, true);

    	$scope.$watch('$ctrl.marker', function(newVal, oldVal){
    		if(newVal){
    			createMarker(newVal,true);
    		} 
    		//	if($scope.marker){
		       // 	$scope.marker.setMap(null);
		       // 	$scope.marker = null;
		      //  }
    		//}
    	});

    	var promOrigin, promDestination;


    	$scope.$watch('$ctrl.origin',function(newVal){
    		if(newVal){

    			function createOrTimeout (){
    				return $timeout(function(){
    					var request = {
						    location: {lat:21.1742900, lng: -86.8465600},
						    radius: '500',
						    query: newVal
						};

		    			service.textSearch(request, function callback(results, status) {
					        if (status === google.maps.places.PlacesServiceStatus.OK) {
					         	$scope.$ctrl.onOriginSearch({results:results});
					        }
					    });
    				},1000);
    			}

    			if(promOrigin){
    				$timeout.cancel(promOrigin);
    			}
				
				promOrigin = createOrTimeout();
    		}
    	});

    	$scope.$watch('$ctrl.destination',function(newVal){

    		if(newVal){

    			function createOrTimeout (){
    				return $timeout(function(){
    					var request = {
						    location: {lat:21.1742900, lng: -86.8465600},
						    radius: '500',
						    query: newVal
						};

		    			service.textSearch(request, function callback(results, status) {
					        if (status === google.maps.places.PlacesServiceStatus.OK) {
					         	$scope.$ctrl.onDestinationSearch({results:results});
					        }
					    });
    				},1000);
    			}

    			if(promOrigin){
    				$timeout.cancel(promOrigin);
    			}
				
				promOrigin = createOrTimeout();
    		}
    	});

    	$scope.$watch('$ctrl.originPlace',function(newVal,oldVal){
    		if(newVal && $scope.$ctrl.destinationPlace){

				  var request = {
				    origin:newVal.geometry.location,
				    destination:$scope.$ctrl.destinationPlace.geometry.location,
				    travelMode: google.maps.TravelMode.DRIVING
				  };

				  directions.route(request, function(result, status) {
				    if (status == google.maps.DirectionsStatus.OK) {
				    	console.log(result.routes[0].overview_polyline, result);
				    	$scope.$ctrl.onRoute({route: result});
				      directionsDisplay.setDirections(result);
				       var leg = result.routes[ 0 ].legs[ 0 ];
				        clearMarkers();
				        createMarker( leg.start_location, false, true );
  						createMarker( leg.end_location, false, true );
  						console.log(leg)
				    } 
				  });
    		}
    	}, true);

		$scope.$watch('$ctrl.destinationPlace',function(newVal,oldVal){
			if(newVal && $scope.$ctrl.originPlace){
    			var request = {
				    origin: $scope.$ctrl.originPlace.geometry.location,
				    destination: newVal.geometry.location,
				    travelMode: google.maps.TravelMode.DRIVING
				  };
				  
				  directions.route(request, function(result, status) {
				    if (status == google.maps.DirectionsStatus.OK) {
				    	$scope.$ctrl.onRoute({route: result});
				      directionsDisplay.setDirections(result);
				       var leg = result.routes[ 0 ].legs[ 0 ];
				        clearMarkers();
				         createMarker( leg.start_location, false, true );
  						createMarker( leg.end_location, false, true );
  						console.log(leg)
				    } else {
				    	$scope.$ctrl.encodedRoute = null;
				    }
				  });
    		}
    	}, true);



		var service;// = new google.maps.places.PlacesService($scope.map);
		var directions;// = new google.maps.DirectionsRenderer();
		var directionsDisplay;//
		var infowindow = new google.maps.InfoWindow();      
	}
})();