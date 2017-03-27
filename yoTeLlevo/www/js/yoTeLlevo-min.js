angular.module("yoTeLlevo",["ionic","angular-toast"]).run(["$ionicPlatform",function(o){o.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}]).config(["$stateProvider","$urlRouterProvider","$ionicConfigProvider","$httpProvider",function(o,e,n,t){o.state("login",{url:"/login",template:"<login-component></login-component>"}).state("register",{url:"/register",template:"<register-component></register-component>"}).state("dashboard",{url:"/dashboard",template:"<dashboard-component></dashboard-component>"}),e.otherwise("/login"),n.views.transition("ios"),n.tabs.position("top"),delete t.defaults.headers.common["X-Requested-With"]}]),function(){function o(o,e,n,t,i,l,a){function r(e){o.cleanMapVariables(),l.fromTemplateUrl(e,{scope:o,animation:"slide-in-up"}).then(function(e){o.modal=e,o.modal.show()})}function s(){r("templates/modals/addNewRoute.html")}function c(){r("templates/modals/addNewPoint.html")}i.sessionStarted=!0,o.tabs={tabIndex:!1},o.cleanMapVariables=function(){o.encodedRoute="",o.searchs={destination:"",origin:""},o.markers=null,o.destinationResults=null,o.originResults=null,o.destinationPlace=null,o.originPlace=null},i.sessionStarted||n.go("login"),o.logout=function(){o.show(),setTimeout(function(){o.hide(),n.go("login")},2e3)},o.show=function(){e.show({template:"Loading...",duration:3e3}).then(function(){console.log("The loading indicator is now displayed")})},o.hide=function(){e.hide().then(function(){console.log("The loading indicator is now hidden")})},o.tabChange=function(){},o.fabOnClick=function(){o.tabs.tabIndex?c():s()},o.closeModal=function(){o.modal.hide(),o.modal&&o.modal.remove()},o.$on("$destroy",function(){o.modal&&o.modal.remove()}),o.$watch("searchs",function(e,n){e&&e.origin&&e.origin!==n.origin&&o.takeOrigin?(o.originLoading=!0,o.searchs.originValue=e.origin):o.takeOrigin=!0,e&&e.destination&&e.destination!=n.destination&&o.takeDest?(o.destinationLoading=!0,o.searchs.destinationValue=e.destination):o.takeDest=!0},!0),o.$watch("encodedRoute",function(o,e){console.log("jpjpojpojpojpojpojpojojojpjpp",o,e)},!0),o.createOrigin=function(e){o.destinationResults=null,o.originResults=e,o.originLoading=!1,o.$apply()},o.createDestination=function(e){o.originResults=null,o.destinationResults=e,o.destinationLoading=!1,o.$apply()},o.addMarkerFirst=function(e,n){o.originPlace&&o.destinationPlace?o.markers=null:o.markers=e,o.destinationResults=null,o.originResults=null,n?(o.takeOrigin=!1,o.searchs.origin=e.name,o.originPlace=e):(o.takeDest=!1,o.searchs.destination=e.name,o.destinationPlace=e)},o.onRoute=function(e){o.encodedRoute=e.routes[0].overview_polyline,o.$apply()},o.saveRoute=function(){o.show(),a(function(){o.closeModal(),o.hide()},1e3)},o.savePoint=function(){o.show(),a(function(){o.closeModal(),o.hide()},1e3)},o.cleanMapVariables()}angular.module("yoTeLlevo").component("dashboardComponent",{bindings:{},templateUrl:"templates/dashboard.html",controller:"dashboardCtrl"}).controller("dashboardCtrl",["$scope","$ionicLoading","$state","$ionicTabsDelegate","$rootScope","$ionicModal","$timeout",o])}(),function(){function o(o,e,n){o.logResults=function(e){o.results=e},o.itemSelected=function(e){o.marker=e,o.results=null}}angular.module("yoTeLlevo").component("findPlaceComponent",{bindings:{},templateUrl:"templates/elements/findPlace.html",controller:"findPlaceCtrl"}).controller("findPlaceCtrl",["$scope","$ionicLoading","$state",o])}(),function(){function o(o,e,n,t){function i(){r.forEach(function(o){o&&(o.setMap(null),o=null)}),r=[]}function l(e,n){n===google.maps.places.PlacesServiceStatus.OK&&(i(),o.$ctrl.onSearch({results:e}))}function a(e,n,t){console.log(e);var i=e.geometry?e.geometry.location:e,l=new google.maps.Marker({map:o.map,position:i,icon:"img/icon-place.png",draggable:t,animation:google.maps.Animation.DROP});r.push(l),console.log(l),google.maps.event.addListener(l,"click",function(){g.setContent(e.name),g.open(o.map,this)}),google.maps.event.addListener(l,"dragend",function(o){if(2==r.length){var e={origin:r[0].position,destination:r[1].position,travelMode:google.maps.TravelMode.DRIVING};u.route(e,function(o,e){if(e==google.maps.DirectionsStatus.OK){d.setDirections(o);var n=o.routes[0].legs[0];console.log(n)}})}}),n&&o.map.setCenter(i),console.log(e)}var r=[];o.encodedRoute="",t(function(){o.map=new google.maps.Map(document.getElementById(o.$ctrl.idMap||"map"),{center:{lat:21.17429,lng:-86.84656},scrollwheel:!0,zoom:12,disableDefaultUI:!0}),c=new google.maps.places.PlacesService(o.map),u=new google.maps.DirectionsService,d=new google.maps.DirectionsRenderer({draggable:!0,map:o.map,suppressMarkers:!0})},2e3),o.marker=null,o.$watch("$ctrl.search",function(o,e){var n={location:{lat:21.17429,lng:-86.84656},radius:"500",query:o};o&&c.textSearch(n,l)},!0),o.$watch("$ctrl.marker",function(o,e){o&&a(o,!0)});var s;o.$watch("$ctrl.origin",function(e){e&&(s&&t.cancel(s),s=function(){return t(function(){var n={location:{lat:21.17429,lng:-86.84656},radius:"500",query:e};c.textSearch(n,function(e,n){n===google.maps.places.PlacesServiceStatus.OK&&o.$ctrl.onOriginSearch({results:e})})},1e3)}())}),o.$watch("$ctrl.destination",function(e){e&&(s&&t.cancel(s),s=function(){return t(function(){var n={location:{lat:21.17429,lng:-86.84656},radius:"500",query:e};c.textSearch(n,function(e,n){n===google.maps.places.PlacesServiceStatus.OK&&o.$ctrl.onDestinationSearch({results:e})})},1e3)}())}),o.$watch("$ctrl.originPlace",function(e,n){if(e&&o.$ctrl.destinationPlace){var t={origin:e.geometry.location,destination:o.$ctrl.destinationPlace.geometry.location,travelMode:google.maps.TravelMode.DRIVING};u.route(t,function(e,n){if(n==google.maps.DirectionsStatus.OK){console.log(e.routes[0].overview_polyline,e),o.$ctrl.onRoute({route:e}),d.setDirections(e);var t=e.routes[0].legs[0];i(),a(t.start_location,!1,!0),a(t.end_location,!1,!0),console.log(t)}})}},!0),o.$watch("$ctrl.destinationPlace",function(e,n){if(e&&o.$ctrl.originPlace){var t={origin:o.$ctrl.originPlace.geometry.location,destination:e.geometry.location,travelMode:google.maps.TravelMode.DRIVING};u.route(t,function(e,n){if(n==google.maps.DirectionsStatus.OK){o.$ctrl.onRoute({route:e}),d.setDirections(e);var t=e.routes[0].legs[0];i(),a(t.start_location,!1,!0),a(t.end_location,!1,!0),console.log(t)}else o.$ctrl.encodedRoute=null})}},!0);var c,u,d,g=new google.maps.InfoWindow}angular.module("yoTeLlevo").component("googleMapComponent",{bindings:{search:"=",onSearch:"&",marker:"=",idMap:"=",origin:"=",destination:"=",onOriginSearch:"&",onDestinationSearch:"&",onRoute:"&",originPlace:"=",destinationPlace:"="},templateUrl:"templates/elements/googleMaps/googleMap.html",controller:"googleMapCtrl"}).controller("googleMapCtrl",["$scope","$ionicLoading","$state","$timeout",o])}(),function(){function o(o,e,n,t){}angular.module("yoTeLlevo").component("listPointsComponent",{bindings:{},templateUrl:"templates/pointsList.html",controller:"listPointCtrl"}).controller("listPointCtrl",["$scope","$ionicLoading","$state","$rootScope",o])}(),function(){function o(o,e,n){}angular.module("yoTeLlevo").component("listRequestComponent",{bindings:{},templateUrl:"templates/requestList.html",controller:"dashboardCtrl"}).controller("listRequestCtrl",["$scope","$ionicLoading","$state",o])}(),function(){function o(o,e,n){o.onAddPoint=function(){console.log("Crear ruta")}}angular.module("yoTeLlevo").component("listRoutesComponent",{bindings:{},templateUrl:"templates/routeList.html",controller:"listRoutesCtrl"}).controller("listRoutesCtrl",["$scope","$ionicLoading","$state",o])}(),function(){function o(o,e,n,t,i){o.login=function(){console.log(this.username,this.password),n.go("dashboard"),o.show(),t.login(this.username,this.password).then(function(){console.log(arguments),o.hide(),n.go("dashboard")},function(e){o.hide(),i.show(e.data.message)})},o.show=function(){e.show({template:"Loading...",duration:3e3}).then(function(){console.log("The loading indicator is now displayed")})},o.hide=function(){e.hide().then(function(){console.log("The loading indicator is now hidden")})}}angular.module("yoTeLlevo").component("loginComponent",{bindings:{},templateUrl:"templates/login.html",controller:"loginCtrl"}).controller("loginCtrl",["$scope","$ionicLoading","$state","$apiClient","toast",o])}(),function(){function o(o,e,n){o.user={},o.register=function(){console.log(o,o.user)}}angular.module("yoTeLlevo").component("registerComponent",{bindings:{},templateUrl:"templates/register.html",controller:"registerCtrl"}).controller("registerCtrl",["$scope","$ionicLoading","$state",o])}(),function(){angular.module("yoTeLlevo").directive("fabButton",["$interval","dateFilter",function(o,e){function n(o,e,n){o.iconClass="ion-android-add"}return{link:n,templateUrl:"templates/directives/fabButton.html"}}])}(),function o(e,n,t){function i(a,r){if(!n[a]){if(!e[a]){var s="function"==typeof require&&require;if(!r&&s)return s(a,!0);if(l)return l(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(o){var n=e[a][1][o];return i(n?n:o)},u,u.exports,o,e,n,t)}return n[a].exports}for(var l="function"==typeof require&&require,a=0;a<t.length;a++)i(t[a]);return i}({1:[function(o,e,n){(function(o){function n(o,e,n,i,l){function a(o,i){var a=t.element('<div class="toast" ng-click="killme($event)">'+o+"</div>"),s=n.$new();return s.killme=function(o){var e=o.srcElement;e.classList.remove("flyIn"),e.classList.add("flyOut"),l(function(){e.remove()},200)},i=i||4e3,e(a)(s),r.append(a),l(function(){a.addClass("flyIn")},0),l(function(){a.removeClass("flyIn"),a.addClass("flyOut"),l(function(){a.remove()},200)},i)}var r=t.element('<div class="toast-container"></div>');return o.find("body").append(r),{show:a}}var t="undefined"!=typeof window?window.angular:void 0!==o?o.angular:null;e.exports=t.module("angular-toast",[]).factory("toast",n).name,n.$inject=["$document","$compile","$rootScope","$controller","$timeout"]}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1]),function(){function o(o,e){var n=function(){return localStorage.getItem("yotellevoApi")},t=function(){return{Authorization:"Basic dXNlcnlvdGVsbGV2bzp5b3RlbGxldm8=","Content-Type":"text/plain"}},i=function(e,i){var l="?";for(var a in i)l+=a+"="+i[a]+"&";return l+="token="+n(),o.get("/api"+e+l,{headers:t()})},l=function(o,n,t){var i=e.defer();return t(o,n).then(function(o){i.resolve(o.data)},i.reject),i.promise};this.login=function(o,e){return l("/login",{username:o,password:e},i)}}angular.module("yoTeLlevo").service("$apiClient",["$http","$q",o])}(),function(){function o(o,e,n){}angular.module("yoTeLlevo").component("cardComponent",{bindings:{},templateUrl:"templates/elements/card/card.html",controller:"cardCtrl"}).controller("cardCtrl",["$scope","$ionicLoading","$state",o])}();