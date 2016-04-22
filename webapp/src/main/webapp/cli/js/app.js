var app = angular.module("CLIsis", ['ngRoute']);

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