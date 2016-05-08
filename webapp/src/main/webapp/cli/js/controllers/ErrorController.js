app.controller('ErrorController',
  ['$rootScope', '$scope',
    function ($rootScope, $scope) {
      $scope.errormessage = $rootScope.errorMessage;
      $rootScope.errorMessage = "";
    }]);