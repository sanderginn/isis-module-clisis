app.controller('HomeController', ['$scope', 'services', '$stateParams',
  function($scope, services, $stateParams) {
  services.getServices().then(function(data) {
    $scope.services = data.data.value;
  })
}]);