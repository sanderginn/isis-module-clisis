app.factory('actions', ['$http', '$q', function ($http, $q) {
  return {
    getActions: function (serviceHref) {
      var deferred = $q.defer();

      $http.get(serviceHref)
        .then(function (data) {
          deferred.resolve(data);
        }, function (err) {
          console.log('Action error: ', err);
        });

      return deferred.promise;
    }
  };
}]);