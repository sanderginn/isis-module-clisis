app.controller('ServiceController', ['$scope', 'services', '$routeParams', function($scope, services, $routeParams) {
  services.success(function(data) {
    $scope.detail = data[$routeParams.id];
  });
}]);