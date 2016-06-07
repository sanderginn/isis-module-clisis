angular.module(
  'clisis.services.preferences', [])


  .service(
    'PreferencesService',
    ['AppConfig', '$rootScope',
      function(AppConfig, $rootScope) {
        var service = this;
        service.preferences = {}

      }]);
