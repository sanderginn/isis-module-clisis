app.factory('services', ['$http', function($http) {
  return $http.get('http://localhost:8080/restful/services')
    .success(function(data) {
      return data;
    })
    .error(function(err) {
      return err;
    });
}]);