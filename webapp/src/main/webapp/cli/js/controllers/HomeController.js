app.controller('HomeController',
  ['$scope', 'services', '$rootScope', 'speechService', '$timeout', 'actions', '$q', '$http', '$state',
    function ($scope, services, $rootScope, speechService, $timeout, actions, $q, $http, $state) {
      if ($state.current.name === 'base.noOutput') {
        $timeout(function () {
          speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
        }, 0);
      }

      if ($rootScope.services === undefined && $http.pendingRequests.length === 0) {
        services.getServices().then(function (data) {
          var actionPromises = [];

          $scope.services = [];
          for (var key in data.data.value) {
            actionPromises.push(actions.getActions(data.data.value[key].href));
          }

          $q.all(actionPromises).then(function (actionResponses) {
            for (var actionResponse in actionResponses) {
              if (Object.keys(actionResponses[actionResponse].data.members).length !== 0) {
                $scope.services.push(data.data.value[actionResponse]);
              }
            }

            $rootScope.services = angular.copy($scope.services);
          }, function (error) {
            console.log(error);
          });
        });
      }

      $scope.$watch('services', function () {
        if ($scope.services !== undefined && $scope.services.length !== 0) {
          $timeout(function () {
            speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
          }, 0);
        }
      });
    }]);
