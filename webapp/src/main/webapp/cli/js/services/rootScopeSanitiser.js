app.factory('rootScopeSanitiser', ['$rootScope', function ($rootScope) {
  return {

    // Removes all stale data from the rootScope.
    // keysToKeep is an array of keys that have to be kept
    sanitiseRootScope: function (keysToKeep) {
      for (var key in $rootScope) {
        if (key[0] !== '$' && key !== 'constructor' && (keysToKeep.indexOf(key) === -1)) {
          delete $rootScope[key];
        }
      }
    }
  }
}]);