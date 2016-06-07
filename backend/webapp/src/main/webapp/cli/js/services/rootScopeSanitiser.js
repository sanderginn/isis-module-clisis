app.factory('rootScopeSanitiser', ['$rootScope', function ($rootScope) {
  var alwaysActive = ['constructor', 'services', 'previousStates', 'addPreviousState'];
  return {

    // Removes all stale data from the rootScope.
    // keysToKeep is an array of keys that have to be kept
    sanitiseRootScope: function (keysToKeep) {
      for (var key in $rootScope) {
        if (key[0] !== '$' && (alwaysActive.indexOf(key) === -1) && (keysToKeep.indexOf(key) === -1)) {
          delete $rootScope[key];
        }
      }
    }
  }
}]);