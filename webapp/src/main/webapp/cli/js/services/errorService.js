app.factory('errorService', ['$state', function ($state) {
  return {
    throwError: function (errorMessage) {
      $state.go('base.error', {"errorMessage": errorMessage});
    }
  }
}]);