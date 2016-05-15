app.controller('CollectionsController',
  ['$scope', '$rootScope', '$stateParams', 'rootScopeSanitiser', 'speechService', '$timeout',
    function ($scope, $rootScope, $stateParams, rootScopeSanitiser, speechService, $timeout) {
      $scope.currentPage = 0;
      $scope.pageSize = 5;

      $scope.show = false;

      $scope.actionResults = $stateParams.actionResults;
      $rootScope.actionResults = angular.copy($scope.actionResults);
      rootScopeSanitiser.sanitiseRootScope(['actionResults', 'services']);

      if ($scope.actionResults !== null) {
        $scope.numberOfPages = Math.ceil(Object.keys($scope.actionResults).length / $scope.pageSize);
      }

      $scope.$watch('actionResults', function () {
        $timeout(function () {
          speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
        }, 0);
      });

      $scope.$on('$showCollectionResults', function () {
        if ($scope.show === false) {
          $scope.show = true;
          $timeout(function () {
            speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
          }, 0);
        }
      });

      $scope.$on('$showNextCollectionResults', function () {
        $scope.currentPage = ($scope.currentPage + 1) % $scope.numberOfPages;
        $timeout(function () {
          speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
        }, 0);
      });

      $scope.$on('$showPreviousCollectionResults', function () {
        if ($scope.currentPage === 0) {
          $scope.currentPage = $scope.numberOfPages - 1;
        } else {
          $scope.currentPage--;
        }
        $timeout(function () {
          speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
        }, 0);
      });
    }]);
