angular.module(
  'clisis.services.authentication', ['clisis.services.preferences'])

  .factory('AuthInterceptor',
    ['$q', '$injector',
      function ($q, $injector) {
        return {
          responseError: function (response) {

            // whenever we get a 401 from the server.
            // * if this happens during the initial login attempt (see AuthService.login) when
            //   we are testing the provided username+password against /restful/user, then we just ignore
            // * if this happens otherwise then it means that we've lost the session, should go back to the login page
            if (response.status === 401) {
              var $state = $injector.get("$state");
              var AuthService = $injector.get("AuthService");

              if ($state.current.name !== "base.login") {
                AuthService.logout();
                $state.go('base.login', {}, {reload: true});
              }
            }

            return $q.reject(response);
          }
        };
      }])

  // install our interceptor for any $http requests
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  })

  .service('AuthService',
    ['$q', '$http', 'Base64', 'AppConfig',
      function ($q, $http, Base64, AppConfig) {

        var LOCAL_TOKEN_KEY = AppConfig.appPrefix + ".authToken"
        var username = '';
        var isAuthenticated = false;
        var basicAuth;

        function loadUserCredentials() {
          var token = readUserCredentials();
          if (token) {
            useCredentials(token);
          }
        }

        function readUserCredentials() {
          return window.localStorage[LOCAL_TOKEN_KEY];
        }

        function storeUserCredentials(name, basicAuth) {
          var token = name + "." + basicAuth;
          window.localStorage[LOCAL_TOKEN_KEY] = name + "." + basicAuth;
          useCredentials(token);
        }

        function useCredentials(token) {
          username = token.split('.')[0];
          basicAuth = token.split('.')[1];
          isAuthenticated = true;
          $http.defaults.headers.common['Authorization'] = 'Basic ' + basicAuth;
        }

        function resetBasicAuthHeader() {
          username = '';
          basicAuth = undefined;
          isAuthenticated = false;

          $http.defaults.headers.common.Authorization = 'Basic ';
        }

        function deleteCachedUserCredentials() {
          window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var login = function (name, pw, basicAuthPrevious) {
          return $q(function (resolve, reject) {

            // attempt to access a resource (we happen to use /restful/user)
            // using the provided name and password
            var basicAuth = pw ? Base64.encode(name + ":" + pw) : basicAuthPrevious
            $http.get(AppConfig.baseUrl + "/restful/user",
              {
                headers: {
                  'Authorization': 'Basic ' + basicAuth,
                  'Cache-Control': 'no-cache',
                  'Pragma': 'no-cache',
                  'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT' // a long time ago
                }
              })
              .then(
                function () {
                  // the user/password is good, so store away in local storage, and also
                  // configure the $http service so that all subsequent calls  use the same 'Authorization' header
                  storeUserCredentials(name, basicAuth);
                  resolve('Login success.');
                },
                function (err) {
                  var storedCredentials = readUserCredentials(name);
                  var enteredCredentials = name + "." + basicAuth;
                  if (err.status === 0 && storedCredentials === enteredCredentials) {
                    resolve('Offline access.');
                  } else {
                    reject('Login Failed.');
                  }
                });
          });
        };

        var logout = function () {
          resetBasicAuthHeader();
          deleteCachedUserCredentials();
        };

        return {
          login: login,
          logout: logout,
          isAuthenticated: function () {
            return isAuthenticated
          },
          username: function () {
            return username
          },
          readUserCredentials: readUserCredentials,
          deleteCachedUserCredentials: deleteCachedUserCredentials
        };

      }]);
