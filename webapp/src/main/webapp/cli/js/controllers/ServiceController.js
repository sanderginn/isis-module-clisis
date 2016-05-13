app.controller('ServiceController',
  ['$rootScope', '$scope', 'services', 'actions', '$stateParams', 'rootScopeSanitiser',
  function($rootScope, $scope, services, actions, $stateParams, rootScopeSanitiser) {
    $scope.show = false;

    // service title and actions
    services.getServices().then(function(servicesResponse) {
      return actions.getActions(servicesResponse.data.value[$stateParams.serviceId].href);
    }).then(function(data) {
      $scope.title = data.data.title;
      $scope.actions = data.data.members;
      $scope.serviceId = $stateParams.serviceId;
      $rootScope.actions = angular.copy($scope.actions);
      $rootScope.serviceId = angular.copy($scope.serviceId);

      rootScopeSanitiser.sanitiseRootScope(['actions', 'serviceId', 'services']);
    });

    $scope.$on('$showActions', function() {
      $scope.show = true;
    });
}]);