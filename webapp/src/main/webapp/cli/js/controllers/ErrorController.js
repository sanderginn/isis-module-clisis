app.controller('ErrorController',
  ['$scope', '$stateParams',
    function ($scope, $stateParams) {
      $scope.errormessage = $stateParams.errorMessage;
    }]);