app.controller('ServiceController', ['$scope', 'services', '$stateParams', function($scope, services, $stateParams) {
  services.success(function(data) {
    $scope.detail = data[$stateParams.id];
  });
}]);