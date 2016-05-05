app.controller('ServiceController',
  ['$rootScope', '$scope', 'services', 'actions', '$stateParams',
  function($rootScope, $scope, services, actions, $stateParams) {

    // service title and actions
    services.getServices().then(function(servicesResponse) {
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