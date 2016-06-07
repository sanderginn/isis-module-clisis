app.controller('ErrorController',
  ['$scope', '$stateParams', 'speechService', '$timeout',
    function ($scope, $stateParams, speechService, $timeout) {
      $scope.errormessage = $stateParams.errorMessage;

      $scope.$watch('errormessage', function() {
        $timeout(function() {
          speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
        }, 0);
      });
    }]);