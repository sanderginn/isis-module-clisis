var app = angular.module("clisis", ['ngRoute', 'clisis.services.preferences', 'clisis.services.authentication']);

app.value('AppConfig', {
  appPrefix: 'clisis',
  baseUrl: "http://127.0.0.1:8080"   // TODO: move to preferences service ?
});

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeController',
      templateUrl: 'views/home.html'
    })
    .when('/services/:id', {
      controller: 'ServiceController',
      templateUrl: 'views/service.html'
    })
    .otherwise({
      redirectTo: '/'
    });
})