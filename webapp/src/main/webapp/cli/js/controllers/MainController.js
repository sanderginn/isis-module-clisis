app.controller('MainController', ['$scope', 'services', function($scope, services) {
  services.success(function(data) {
    //console.log(data.value);
    //console.log(data.value[0].title);
    $scope.services = data.value;
    $scope.services.forEach(function(service) { console.log(service.title); });
  })
}]);