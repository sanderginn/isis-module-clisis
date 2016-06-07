app.factory('services',
  ['$http', '$q', 'errorService',
    function ($http, $q, errorService) {
      return {
        getServices: function () {
          var deferred = $q.defer();

          $http.get('/restful/services')
            .then(function (data) {
              deferred.resolve(data);
            }, function (error) {
              errorService.throwError(error.data["x-ro-invalidReason"]);
            });

          return deferred.promise;
        }
      }
    }]);