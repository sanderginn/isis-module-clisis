app.controller('HomeController', ['$scope', 'services', '$rootScope',
  function ($scope, services, $rootScope) {
    services.getServices().then(function (data) {
      $scope.services = data.data.value;
      $rootScope.services = angular.copy($scope.services);
    });
  }]);
