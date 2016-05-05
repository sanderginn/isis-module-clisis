var app = angular.module("clisis", ['ngResource', 'http-auth-interceptor', "ui.router", 'clisis.services.preferences', 'clisis.services.authentication']);

app.value('AppConfig', {
  appPrefix: 'clisis',
  baseUrl: "http://127.0.0.1:8080"   // TODO: move to preferences service ?
});

app.config(
  ["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      controller: 'HomeController as ctrl',
      templateUrl: 'views/home.html'
    })
    .state('services', {
      url: '/services/:serviceId',
      controller: 'ServiceController as ctrl',
      templateUrl: 'views/service.html'
    })
    .state('serviceAction', {
      url: '/services/:serviceId/:actionId',
      controller: 'ActionController as ctrl',
      templateUrl: 'views/action.html'
    })
    .state('object', {
      url: '/objects/:objectType/:objectId',
      controller: 'ObjectController as ctrl',
      templateUrl: 'views/object.html'
    })
    .state('objectAction', {
      url: '/objects/:objectType/:objectId/actions/:actionId',
      controller: 'ActionController as ctrl',
      templateUrl: 'views/action.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginController as ctrl'
    });

    $urlRouterProvider.otherwise(function ($injector, $location) {
      var $state = $injector.get("$state");
      $state.go("home");
    });
}]);