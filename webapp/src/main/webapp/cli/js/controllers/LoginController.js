app.controller('LoginController',
  ['$rootScope', '$state', 'AuthService', 'AppConfig', 'PreferencesService',
    function ($rootScope, $state, AuthService, AppConfig, PreferencesService) {

      var ctrl = this;

      ctrl.preferences = PreferencesService.preferences;
      ctrl.credentials = {
        username: null,
        password: null
      };

      ctrl.login =
        function (data) {
          var username = ctrl.credentials.username;
          var password = ctrl.credentials.password;

          AuthService.login(username, password).then(
            function (authenticated) {
              ctrl.credentials.username = null;
              ctrl.credentials.password = null;
              ctrl.error = undefined;
              $state.go('base.home', {}, {reload: true});
            }, function (err) {
              ctrl.credentials.username = null;
              ctrl.credentials.password = null;
              ctrl.error = "Incorrect username or password";
            });
        };

      // attempt to auto-login using previous credentials

      var previousTokenIfAny = AuthService.readUserCredentials();
      if (previousTokenIfAny) {
        var username = previousTokenIfAny.split('.')[0];
        var basicAuth = previousTokenIfAny.split('.')[1];

        AuthService.login(username, null, basicAuth).then(
          function (authenticated) {
            $state.go('base.home', {}, {reload: true});
          }, function (err) {
            AuthService.deleteCachedUserCredentials();
          });
      }
    }]);