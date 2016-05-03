app.controller('ActionController',
  ['$scope', 'services', 'actions', '$stateParams', 'PreferencesService',
  function ($scope, services, actions, $stateParams, PreferencesService) {

      var ctrl = this;
      ctrl.preferences = PreferencesService.preferences;
      ctrl.service = {};

      actions.invokeAction($stateParams.serviceId, $stateParams.actionId).then(function(actionsResponse) {
          $scope.actionResults = actionsResponse.result.value;

          // assign object type to all action results
          for (var actionResult in $scope.actionResults) {
              $scope.actionResults[actionResult].objectType = actions.getObjectType($scope.actionResults[actionResult].href);
          }

          console.log($scope.actionResults);
      });
}]);