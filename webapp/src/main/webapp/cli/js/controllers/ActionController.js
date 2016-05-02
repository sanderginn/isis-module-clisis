app.controller('ActionController',
  ['$scope', 'services', 'actions', '$stateParams', 'PreferencesService',
  function ($scope, services, actions, $stateParams, PreferencesService) {

      var ctrl = this;
      ctrl.preferences = PreferencesService.preferences;
      ctrl.service = {};

      actions.invokeAction($stateParams.serviceId, $stateParams.actionId).then(function(actionsResponse) {
          console.log(actionsResponse.data);
          $scope.actionResults = actionsResponse.data.result.value;
          console.log($scope.actionResults);
      });
}]);