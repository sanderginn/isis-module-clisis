app.controller('ServiceController',
  ['$rootScope', '$scope', 'services', 'actions', '$stateParams', 'rootScopeSanitiser', 'speechService', '$timeout',
  function($rootScope, $scope, services, actions, $stateParams, rootScopeSanitiser, speechService, $timeout) {
    $scope.show = false;

    // service title and actions
    actions.getActions($stateParams.serviceHref).then(function(data) {
      $scope.title = data.data.title;
      $scope.actions = [];
      for (var action in data.data.members) {
        $scope.actions.push(data.data.members[action]);
      }

      $scope.serviceId = $stateParams.serviceId;
      $scope.serviceHref = $stateParams.serviceHref;
      $rootScope.actions = angular.copy($scope.actions);
      $rootScope.serviceId = angular.copy($scope.serviceId);
      $rootScope.serviceHref = angular.copy($scope.serviceHref);

      rootScopeSanitiser.sanitiseRootScope(['actions', 'serviceId', 'serviceHref']);
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