app.controller('ServiceController',
  ['$rootScope', '$scope', 'services', 'actions', '$stateParams', 'rootScopeSanitiser', 'speechService', '$timeout',
  function($rootScope, $scope, services, actions, $stateParams, rootScopeSanitiser, speechService, $timeout) {
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
      speechService.speak("Output: " + document.getElementById("service-actions").innerText);
    });

    $scope.$watch('title', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $timeout(function() {
          speechService.speak("Output: " + document.getElementById('clisis-output').innerText);
        }, 0);
      }
    });
}]);