app.controller('MainController', ['$scope', 'services', function($scope, services) {
  services.success(function(data) {
    $scope.services = data.value;
  });
}]);