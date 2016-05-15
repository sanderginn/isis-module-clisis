app.controller('HelpController',
  ['$scope', '$stateParams',
    function ($scope, $stateParams) {
      $scope.noOutput = $stateParams.previousState === 'base.noOutput';
      $scope.home = $stateParams.previousState === 'base.home';
      $scope.services = $stateParams.previousState === 'base.services';
      $scope.serviceAction = $stateParams.previousState === 'base.serviceAction';
      $scope.serviceActionParams = $stateParams.previousState === 'base.serviceActionParams';
      $scope.object = $stateParams.previousState === 'base.object';
      $scope.objectAction = $stateParams.previousState === 'base.objectAction';
      $scope.objectActionParams = $stateParams.previousState === 'base.objectActionParams';
      $scope.collection = $stateParams.previousState === 'base.collection';
      $scope.error = $stateParams.previousState === 'base.error';

      console.log($scope);
    }]);