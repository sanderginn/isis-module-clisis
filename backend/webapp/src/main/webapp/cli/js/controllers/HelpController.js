app.controller('HelpController',
  ['$scope', '$rootScope',
    function ($scope, $rootScope) {
      var lastState = $rootScope.previousStates[$rootScope.previousStates.length - 1];

      switch (lastState.name) {
        case 'base.noOutput':
          $scope.currentContext = 'home';
          $scope.noOutput = true;
          break;

        case 'base.home':
          $scope.currentContext = 'home';
          $scope.home = true;
          break;

        case 'base.services':
          $scope.currentContext = 'menu';
          $scope.services = true;
          break;

        case 'base.serviceActionParams':
          $scope.currentContext = 'action parameters';
          $scope.serviceActionParams = true;
          break;

        case 'base.object':
          $scope.currentContext = 'object';
          $scope.object = true;
          break;

        case 'base.objectActionParams':
          $scope.currentContext = 'action parameters';
          $scope.objectActionParams = true;
          break;

        case 'base.collection':
          $scope.currentContext = 'collection';
          $scope.collection = true;
          break;

        case 'base.error':
          $scope.currentContext = 'error message';
          $scope.error = true;
          break;
      }
    }]);