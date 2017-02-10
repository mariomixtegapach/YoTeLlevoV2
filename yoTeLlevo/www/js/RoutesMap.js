//The map as a js object
var map;
var directionsDisplay;
var initialPoint = google.maps.LatLng("21.1809338","-86.9063555");
var directionsService = new google.maps.DirectionsService();
var _waypoints = [];
var lastRoute = "";
var routing = true;
var pointintg = true;
var showingIcons = false;
var scaleFactor = 3;
var offset = 0;
var size = 50;
var markers = [];
var circle = undefined;
var minRadius = 1;
var maxRadius = 1000;


var toSave = {
	routeEncoded:'',
	center:{},
	zoomLevel:0,
	imgEndRoute:''
};

var toSavePoint = {
	pointEncoded:'',
	zoomLevel:0,
	imgPoint:'',
	name:'',
	radialDistance:0
};

/**
	This function add a marker at the given location
*/

var icons = {
	start: new google.maps.MarkerImage(
			'/images/maps/--ignore-upqroo-logo.png',
			new google.maps.Size(16*scaleFactor, 16*scaleFactor),
			new google.maps.Point(0, offset*scaleFactor),
			new google.maps.Point(size/2, size/2),
			new google.maps.Size(16*scaleFactor, 16*scaleFactor)
	),
	end: new google.maps.MarkerImage(
			'/images/maps/location.png',
			new google.maps.Size(16*scaleFactor, 16*scaleFactor),
			new google.maps.Point(0, offset*scaleFactor),
			new google.maps.Point(size/2, size/2),
			new google.maps.Size(16*scaleFactor, 16*scaleFactor)
	)
};

function createIcon(src) {
	return new google.maps.MarkerImage(
			src,
			new google.maps.Size(16 * scaleFactor, 16 * scaleFactor),
			new google.maps.Point(0, offset * scaleFactor),
			new google.maps.Point(size / 2, size / 2),
			new google.maps.Size(16 * scaleFactor, 16 * scaleFactor)
	);
}

function addMarker(location,icon,title){
	 var marker = new google.maps.Marker({
		 position: location,
		 map: map,
		 icon: icon,
		 title: title
	  });

	markers.push(marker);
	return marker;
}

function clearMarkers(){
	markers.forEach(function(e,i){
		e.setMap(null);
	});

	markers = [];
}



$(document).ready(function(){
	var initRoute = function() {
		function initialize() {
			directionsDisplay = new google.maps.DirectionsRenderer({
				draggable: true,
				suppressMarkers: true
			});

			var mapProp = {
				center: new google.maps.LatLng(21.1809338, -86.9063555),
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
			initialPoint = new google.maps.LatLng(21.1809338, -86.9063555);
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					map.setCenter(initialLocation);

					//addMarker(initialLocation, undefined, "Tu posicion actual");
				}, function () {
					alert("Does not support");
				});
			}
			else {
				alert("Does not support");
			}
		}

		initialize();

		$('#new-route-form').validate({
			rules: {
				route_name: "required"
			},
			messages: {
				route_name: {
					required: "Agrega un nombre a la ruta"
				}
			}

		});

		/*Events of the map*/
		//-------------------On  click    ----------------------------
		google.maps.event.addListener(map, 'click', startRoute);


		google.maps.event.addListener(directionsDisplay, 'directions_changed', logNewRoute);

		//------------------------------------------------------------
		/*Events of the map*/


		/*Function Calculing the route*/
		function calcRoute(start, end) {
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(start);
			bounds.extend(end);
			map.fitBounds(bounds);
			renderRouteGivenTwoPoints(start, end);
		}

		/* Renders routes sections */

		function renderRoute(request, cb) {
			directionsService.route(request, function (response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					directionsDisplay.setMap(map);
					var leg = response.routes[0].legs[0];
					addMarker(leg.start_location, icons.start, "UPQROO");
					var endMarker = addMarker(leg.end_location, icons.end, 'Destino');
					toSave.imgEndRoute = icons.end.url;

					endMarker.addListener('click', chooseImage);

					disableRouting();
					$('.save-route').removeAttr('disabled');
				} else {
					alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
				}

				if (cb) {
					console.log("Callback")
					cb();
				}
			});
		}

		function renderRouteGivenTwoPoints(start, end) {
			var request = {
				origin: start,
				destination: end,
				travelMode: google.maps.TravelMode.DRIVING
			};

			renderRoute(request);
		}

		/* Utilities */

		function createIcon(src) {
			return new google.maps.MarkerImage(
					src,
					new google.maps.Size(16 * scaleFactor, 16 * scaleFactor),
					new google.maps.Point(0, offset * scaleFactor),
					new google.maps.Point(size / 2, size / 2),
					new google.maps.Size(16 * scaleFactor, 16 * scaleFactor)
			);
		}

		function setPoints(rawDirections) {
			if (rawDirections != "") {
				_waypoints = google.maps.geometry.encoding.decodePath(lastRoute);
				//lastRoute = rawDirections;
				console.log(lastRoute);
			}
		}


		/*Events*/
		function logNewRoute() {
			lastRoute = directionsDisplay.directions.routes[0].overview_polyline;
			var points = google.maps.geometry.encoding.decodePath(lastRoute);
			$.each(points, function (i, e) {
				e.x = e.lat();
				e.y = e.lng();
			});
			console.log(directionsDisplay.directions);
			console.log(lastRoute);
			toSave.routeEncoded = lastRoute;
			toSave.center = {
				lat: map.getCenter().lat(),
				lng: map.getCenter().lng()
			}
			toSave.zoomLevel = map.getZoom();
			setPoints(lastRoute);
		}

		function startRoute(event) {
			if (!routing) return;

			routing = false;
			var pointTwo = event.latLng;
			clearMarkers();
			calcRoute(initialPoint, pointTwo);
		}

		function chooseImage() {
			$('.img-marker').attr('data-to-insert', '1');
			if (showingIcons) {
				$('.icons-set').hide();
				showingIcons = false;
			} else {
				$('.icons-set').show();
				showingIcons = true;
			}
		}

		/*Input changing*/

		function enableRouting() {
			$('#panel-new-route').hide();

			routing = true;

			$('.message').show();
		}

		function disableRouting() {
			$('#panel-new-route').show();
			routing = false;


			$('.message').hide();
		}

		function addImageToMarker() {
			var src = $(this).attr('src');
			var toAdd = $(this).attr('data-to-insert');
			var location = markers[toAdd].position;
			var title = markers[toAdd].title;

			markers[toAdd].setMap(null);
			markers.splice(toAdd, 1);
			addMarker(location, createIcon(src), title).addListener('click', chooseImage);



		}

		function saveRoute() {
			if ($('#new-route-form').valid()) {
				toSave.name = $('#new-route-name').val();
				var settings = {
					"async": true,
					"url": "http://localhost:3000/users/routes/new",
					"method": "POST",
					"processData": false,
					"contentType": false,
					"mimeType": "multipart/form-data",
					"headers": {
						"content-type": "application/json"
					},
					"data": JSON.stringify(toSave),
					timeout: 5000
				};


				$.ajax(settings).done(function (response) {
					var response = JSON.parse(response);
					if (response.errorMsg) {
						//window.location.href = "/users/error";
						alert(response.errorMsg);
					} else {
						window.location.href = "../myroutes";
					}
					console.log(response);
				}).fail(function (err) {
					alert("Connection error");
				});
			}

		}

		/*DOM Event*/

		$('.enable-routing').click(enableRouting);
		$('.disable-routing').click(disableRouting);
		$('.img-marker').click(addImageToMarker);
		$('.save-route').click(saveRoute);
	};

	var initPoints = function(){
		function initialize() {

			var mapProp = {
				center: new google.maps.LatLng(21.1809338, -86.9063555),
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
			initialPoint = new google.maps.LatLng(21.1809338, -86.9063555);
		}

		initialize();

		$('#new-point-form').validate({
			rules: {
				point_name: "required"
			},
			messages: {
				point_name: {
					required: "Agrega un nombre al punto"
				}
			}

		});

		/*Events of the map*/
		//-------------------On  click    ----------------------------
		google.maps.event.addListener(map, 'click', startPointing);

		function startPointing(event) {
			if (!pointintg) return;

			if(circle != undefined){
				circle.setMap(null);
			}

			console.log(event);
			pointintg = false;
			clearMarkers();
			var endMarker = addMarker(event.latLng,icons.end,'Mi destino');
			createToSave(event.latLng,icons.end,'Mi destino');
			endMarker.addListener('click', chooseImage);
			disablePointing();

			circle = new google.maps.Circle({
				map: map,
				radius: minRadius,    // 10 miles in metres
				fillColor: '#AA0000'
			});

			circle.bindTo('center', endMarker, 'position');
			$("#radioInMeters").val(minRadius+' mts');
			$('#panel-new-route').show();

		}

		function renameMarker() {
			var old = markers[0];
			var newTitle = $('#new-point-name').val();
			var icon = old.icon;
			var location = old.position;
			clearMarkers();
			addMarker(location,icon,newTitle).addListener('click', chooseImage);

			createToSave(location,icon,newTitle);
		}

		function chooseImage() {
			$('.img-marker').attr('data-to-insert', '1');
			if (showingIcons) {
				$('.icons-set').hide();
				showingIcons = false;
			} else {
				$('.icons-set').show();
				showingIcons = true;
			}
		}

		function enablePointing() {
			$('#panel-new-route').hide();

			pointintg = true;

			$('.message').show();
		}

		function disablePointing() {
			$('#panel-new-route').show();
			pointintg = false;
			$('.message').hide();
			if(markers.length > 0){
				$('.save-route').removeAttr('disabled');
			}
		}

		function addImageToMarker() {
			var src = $(this).attr('src');
			var toAdd = $(this).attr('data-to-insert');
			var location = markers[toAdd-1].position;
			var title = markers[toAdd-1].title;

			markers[toAdd-1].setMap(null);
			markers.splice(toAdd-1, 1);
			addMarker(location, createIcon(src), title).addListener('click', chooseImage);

			createToSave(location,createIcon(src),title);

		}

		function savePoint() {

			if($(this).attr('disabled') != undefined){
				return;
			}

			if ($('#new-point-form').valid()) {
				toSavePoint.name = $('#new-point-name').val();
				var settings = {
					"async": true,
					"url": "http://localhost:3000/users/points/new",
					"method": "POST",
					"processData": false,
					"contentType": false,
					"mimeType": "multipart/form-data",
					"headers": {
						"content-type": "application/json"
					},
					"data": JSON.stringify(toSavePoint),
					timeout: 5000
				};


				$.ajax(settings).done(function (response) {
					console.log('ok');
				}).fail(function (err) {
					alert("Error " + err);
				});
			}

		}

	    function createToSave(location,icon,newTitle){
			toSavePoint.pointEncoded ={
				lat: location.lat(),
				lng: location.lng()
			};
			toSavePoint.imgPoint = icon.url;
			toSavePoint.name = newTitle;
			console.log(toSavePoint);
		}

		function isValid(val){
			if(val <= maxRadius && val >= minRadius){
				return true;
			} else {
				return false;
			}
		}

		function newRadio(rad){
			circle.setRadius(rad);
		}

		/* Events of elements*/
		$('.enable-routing').click(enablePointing);
		$('.disable-routing').click(disablePointing);
		$('.img-marker').click(addImageToMarker);
		$('.save-route').click(savePoint);
		$('#new-point-name').change(renameMarker);

		$("#radioInMeters").change( function(){
			$("#radioInMeters").removeClass('error');
			$('#radioInMeters-errors').hide();
			if(!isNaN(Number.parseInt(this.value))) {
				var valNum = Number.parseInt(this.value);
				if(isValid(valNum)) {
					newRadio(valNum);
					toSavePoint.radialDistance = this.value.replace('mts', '');

				} else {
					newRadio(minRadius);
					$(this).addClass('error');
					toSavePoint.radialDistance = minRadius;
					$('#radioInMeters-errors').show();
				}
			} else {
				$(this).val(minRadius +' mts');
				newRadio(minRadius);
			}

			//$("#radioInMeters-text").val(this.value + ' mts');
		});

	};

	if(routeView){
		pointintg = false;
		initRoute();
	} else if(viewPoint){
		routing = false;
		pointintg = true;
		initPoints();

		if(pointing!= undefined){
			pointintg = false;
			var count = Number.parseInt($("#count-points").text());
			var latslng = [];
			for(var i = 0; i < count; i++){
				var latlng = $('#'+i+'-point').text().split(',');
				var name = $('#'+i+'-pointname').text();
				var icon = createIcon($('#'+i+'-pointIcon').text());
				latslng.push(new google.maps.LatLng(latlng[0],latlng[1]));
				var marker = addMarker(new google.maps.LatLng(latlng[0],latlng[1]),icon,name);
				var radio = Number.parseInt($('#'+i+'-pointRadio').text());
				var circleTmp = new google.maps.Circle({
					map: map,
					radius: radio,    // 10 miles in metres
					fillColor: '#AA0000'
				});
				var iw = new google.maps.InfoWindow({
					content: name
				});
				 iw.open(map, marker);

				circleTmp.bindTo('center', marker, 'position');


			}

			console.log(latslng);
		}
	}

	setTimeout(function(){
		$('img[src="http://maps.gstatic.com/mapfiles/api-3/images/mapcnt6.png"]').remove();//.hide()
	},2000)
});




