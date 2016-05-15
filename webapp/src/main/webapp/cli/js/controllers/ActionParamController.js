app.controller('ActionParamController',
  ['$scope', '$rootScope', '$stateParams', 'rootScopeSanitiser', '$sce', 'errorService', '$timeout', 'speechService',
    function ($scope, $rootScope, $stateParams, rootScopeSanitiser, $sce, errorService, $timeout, speechService) {

      var params = JSON.parse($stateParams.parameters);
      for (var param in params) {
        params[param].value = null;
        if (params[param].hasOwnProperty('choices')) {
          var choicesText = "<ol start='0'>";
          for (var choice in params[param].choices) {
            choicesText += "<li>" + params[param].choices[choice].title + "</li>";
          }
          choicesText += "</ol>";
          params[param].choicesText = $sce.trustAsHtml(choicesText);
        }
      }

      $scope.parameters = angular.copy(params);

      $scope.$on('$fieldInputEvent', function (event, data) {
        if (parseInt(data.fieldId) < 0 || (parseInt(data.fieldId) > (Object.keys($scope.parameters).length - 1))) {
          errorService.throwError('Field ID ' + data.fieldId + 'does not exists');
        } else {
          $scope.parameters[Object.keys($scope.parameters)[data.fieldId]].value = data.fieldValue;
          $rootScope.parameters = angular.copy($scope.parameters);

          if ($stateParams.serviceId !== undefined) {
            $rootScope.serviceId = $stateParams.serviceId;
            $rootScope.actionId = $stateParams.actionId;
            rootScopeSanitiser.sanitiseRootScope(['serviceId', 'actionId', 'parameters', 'services']);
          } else if ($stateParams.objectType !== undefined) {
            $rootScope.objectType = $stateParams.objectType;
            $rootScope.objectId = $stateParams.objectId;
            $rootScope.actionId = $stateParams.actionId;
            rootScopeSanitiser.sanitiseRootScope(['objectType', 'objectId', 'actionId', 'parameters', 'services']);
          }
        }
      });

      $scope.$watch('parameters', function () {
        $timeout(function() {
          speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
        }, 0);
      });
    }]);