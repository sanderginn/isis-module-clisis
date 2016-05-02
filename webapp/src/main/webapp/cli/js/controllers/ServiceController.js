app.controller('ServiceController',
  ['$rootScope', '$scope', 'services', 'actions', '$stateParams', 'PreferencesService',
  function($rootScope, $scope, services, actions, $stateParams, PreferencesService) {

    var ctrl = this;
    ctrl.preferences = PreferencesService.preferences;
    ctrl.service = {};

    // service title and actions
    $scope.data = services.getServices().then(function(servicesResponse) {
      return actions.getActions(servicesResponse.data.value[$stateParams.serviceId].href);
    }).then(function(data) {
      $scope.data = data.data;
      $scope.serviceId = $stateParams.serviceId;
    });

    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
      //save the previous state in a rootScope variable so that it's accessible from everywhere
      $rootScope.previousState = from;
      //console.log(from);
    });
}]);