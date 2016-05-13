app.controller('CollectionsController',
  ['$scope', '$rootScope', '$stateParams', 'rootScopeSanitiser',
    function($scope, $rootScope, $stateParams, rootScopeSanitiser) {
        $scope.actionResults = $stateParams.actionResults;
        $rootScope.actionResults = angular.copy($scope.actionResults);
        rootScopeSanitiser.sanitiseRootScope(['actionResults', 'services']);
    }]);
