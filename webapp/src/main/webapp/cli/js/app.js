var input = {
  controller: 'InputController as ctrl',
  templateUrl: 'views/input.html'
};

var app = angular.module("clisis", ['ngResource', 'http-auth-interceptor', "ui.router", 'clisis.services.preferences', 'clisis.services.authentication']);

app.value('AppConfig', {
  appPrefix: 'clisis',
  baseUrl: "http://127.0.0.1:8080"   // TODO: move to preferences service ?
});

app.config(
  ["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('base', {
          abstract: true,
          views: {
            "": {
              templateUrl: 'views/base.html'
            }
          }
        })
        .state('base.noOutput', {
          url: '/',
          views: {
            input: input,

            // change in final version
            output: {controller: 'HomeController as ctrl', templateUrl: 'views/home.html'}
          }
        })
        .state('base.home', {
          url: '/',
          views: {
            input: input,

            output: {
              controller: 'HomeController as ctrl',
              templateUrl: 'views/home.html'
            }
          }
        })
        .state('base.services', {
          url: '/services/:serviceId',
          views: {
            input: input,

            output: {
              controller: 'ServiceController as ctrl',
              templateUrl: 'views/service.html'
            }
          }
        })
        .state('base.serviceAction', {
          url: '/services/:serviceId/:actionId',
          views: {
            input: input,

            output: {
              controller: 'ActionController as ctrl',
              templateUrl: 'views/action.html'
            }
          }
        })
        .state('base.object', {
          url: '/objects/:objectType/:objectId',
          views: {
            input: input,

            output: {
              controller: 'ObjectController as ctrl',
              templateUrl: 'views/object.html'
            }
          }
        })
        .state('base.objectAction', {
          url: '/objects/:objectType/:objectId/actions/:actionId',
          views: {
            input: input,

            output: {
              controller: 'ActionController as ctrl',
              templateUrl: 'views/action.html'
            }
          }
        })
        .state('base.login', {
          url: '/login',
          views: {
            input: {
              templateUrl: 'views/login.html',
              controller: 'LoginController as ctrl'
            },

            output: {}
          }
        })
        .state('base.error', {
          url: '/error',
          views: {
            input: input,

            output: {
              controller: 'ErrorController as ctrl',
              templateUrl: 'views/error.html'
            }
          }
        });

      $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("base.home");
      });
    }]);