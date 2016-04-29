app.controller('HomeController', ['$scope', 'services', function($scope, services) {
  services.getServices().then(function(data) {
    $scope.services = data.data.value;
  })
}]);