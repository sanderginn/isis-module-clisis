app.controller('HomeController', ['$scope', 'services', '$rootScope', 'speechService', '$timeout',
  function ($scope, services, $rootScope, speechService, $timeout) {
    services.getServices().then(function (data) {
      $scope.services = data.data.value;
      $rootScope.services = angular.copy($scope.services);
    });

    $scope.$watch('services', function(oldValue, newValue) {
      if (oldValue !== newValue) {
        $timeout(function () {
          speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
        }, 0);
      }
    });
  }]);
