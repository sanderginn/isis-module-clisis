app.controller('HelpController',
  ['$scope', '$rootScope',
    function ($scope, $rootScope) {
      var lastState = $rootScope.previousStates[$rootScope.previousStates.length - 1];
      $scope.noOutput = lastState.name === 'base.noOutput';
      $scope.home = lastState.name === 'base.home';
      $scope.services = lastState.name === 'base.services';
      $scope.serviceAction = lastState.name === 'base.serviceAction';
      $scope.serviceActionParams = lastState.name === 'base.serviceActionParams';
      $scope.object = lastState.name === 'base.object';
      $scope.objectAction = lastState.name === 'base.objectAction';
      $scope.objectActionParams = lastState.name === 'base.objectActionParams';
      $scope.collection = lastState.name === 'base.collection';
      $scope.error = lastState.name === 'base.error';
    }]);