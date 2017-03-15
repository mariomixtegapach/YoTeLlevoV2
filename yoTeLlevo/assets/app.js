// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('yoTeLlevo', ['ionic','angular-toast'])

.run(['$ionicPlatform',function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}])

  .config(['$stateProvider', '$urlRouterProvider','$ionicConfigProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        template: '<login-component></login-component>',
      })
      .state('register', {
        url: '/register',
        template: '<register-component></register-component>',
      })
      .state('dashboard', {
        url: '/dashboard',
        template: '<dashboard-component></dashboard-component>'
      });
      

    $urlRouterProvider.otherwise('/login');


    $ionicConfigProvider.views.transition('ios');
    $ionicConfigProvider.tabs.position('top');

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
