app.factory('services', ['$http', '$q', function ($http, $q) {
  return {
    getServices: function () {
      var deferred = $q.defer();

      $http.get('/restful/services')
        .then(function (data) {
          deferred.resolve(data);
        }, function (error) {
          console.log('Services error: ', err);
        });

      return deferred.promise;
    }
  }
}]);