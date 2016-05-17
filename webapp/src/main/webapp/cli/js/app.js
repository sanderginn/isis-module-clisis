var input = {
  controller: 'InputController as ctrl',
  templateUrl: 'views/input.html',
  resolve: {
    previousState: [
      "$state", "$rootScope",
      function ($state, $rootScope) {
        if ($rootScope.addPreviousState) {
          var currentStateData = {
            name: $state.current.name,
            params: $state.params
          };
          return currentStateData;
        }
      }
    ]
  }
};

var welcomeTemplate = "<h3>Welcome to CLIsis.</h3>";

var app = angular.module("clisis", ['ngResource', 'http-auth-interceptor', "ui.router", 'clisis.services.preferences', 'clisis.services.authentication']);

app.value('AppConfig', {
  appPrefix: 'clisis',
  baseUrl: "http://127.0.0.1:8080"
});

app.config(
  ['$stateProvider', '$urlRouterProvider',
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

            output: {
              controller: 'HomeController as ctrl',
              template: welcomeTemplate + "<p>Type 'help' for available commands.</p>"
            }
          }
        })
        .state('base.home', {
          url: '/services',
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
          url: '/services/:serviceId/:actionId/invoke',
          params: {
            parameters: null
          },
          views: {
            input: input,

            output: {
              controller: 'ActionController as ctrl'
            }
          }
        })
        .state('base.serviceActionParams', {
          url: '/services/:serviceId/:actionId',
          params: {
            parameters: null
          },
          views: {
            input: input,

            output: {
              controller: 'ActionParamController as ctrl',
              templateUrl: 'views/actionParams.html'
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
          url: '/objects/:objectType/:objectId/actions/:actionId/invoke',
          params: {
            params: null
          },
          views: {
            input: input,

            output: {
              controller: 'ActionController as ctrl'
            }
          }
        })
        .state('base.objectActionParams', {
          url: '/objects/:objectType/:objectId/actions/:actionId',
          params: {
            parameters: null
          },
          views: {
            input: input,

            output: {
              controller: 'ActionParamController as ctrl',
              templateUrl: 'views/actionParams.html'
            }
          }
        })
        .state('base.collection', {
          url: '/collection',
          params: {
            actionResults: null,
          },
          views: {
            input: input,

            output: {
              controller: 'CollectionsController as ctrl',
              templateUrl: 'views/collection.html'
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

            output: {
              template: welcomeTemplate
            }
          }
        })
        .state('base.error', {
          url: '/error',
          params: {
            errorMessage: ""
          },
          views: {
            input: input,

            output: {
              controller: 'ErrorController as ctrl',
              templateUrl: 'views/error.html'
            }
          }
        })
        .state('base.help', {
          url: '/help',
          views: {
            input: input,

            output: {
              controller: 'HelpController as ctrl',
              templateUrl: 'views/help.html'
            }
          }
        });

      $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get("$state");
        $state.go("base.home");
      });
    }]);

app.filter('substringAfterChar', function () {
  return function (input, splitChar) {
    if (input !== undefined) {
      return input.split(splitChar).pop();
    } else {
      return null;
    }
  }
});

app.filter('splitToLowerCase', function () {
  return function (input) {
    if (input !== undefined) {
      return input.split(/(?=[A-Z])/).join(" ").toLowerCase();
    } else {
      return null;
    }
  }
});

app.filter('startFrom', function () {
  return function (input, start) {
    if (input !== undefined && input !== null) {
      start = +start;
      return input.slice(start);
    }
  }
});