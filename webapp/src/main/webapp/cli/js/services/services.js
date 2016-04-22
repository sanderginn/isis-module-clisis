app.factory('services', ['$http', function($http) {
  return $http.get('/restful/services')
    .success(function(data) {
      return data;
    })
    .error(function(err) {
      return err;
    });
}]);