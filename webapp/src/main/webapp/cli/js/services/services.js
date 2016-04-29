app.factory('services', ['$http', function ($http) {
  return {
    getServices: function () {
      return $http.get('/restful/services')
        .then(function (data) {
          return data;
        }, function (error) {
          console.log('Services error: ', err);
        });
    }
  }
}]);