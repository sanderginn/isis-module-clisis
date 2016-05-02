app.factory('actions', ['$http', '$q', 'services', function ($http, $q, services) {
  var obj = {

    //return {
    getActions: function (serviceHref) {
      var deferred = $q.defer();

      $http.get(serviceHref)
        .then(function (data) {
          deferred.resolve(data);
        }, function (err) {
          console.log('getActions error: ', err);
        });

      return deferred.promise;
    },

    invokeAction: function (serviceId, actionId) {
      var deferred = $q.defer();

      // get services list
      services.getServices().then(function (servicesResponse) {
        // get actions for queried service
        return obj.getActions(servicesResponse.data.value[serviceId].href);
      }).then(function (actionsResponse) {
        // get invocation url for queried action
        var actionHref = actionsResponse.data.members[actionId].links[0].href;

        $http.get(actionHref).then(function (actionResponse) {
          // action has no parameters, continue with invocation
          if (Object.keys(actionResponse.data.parameters).length == 0) {
            $http.get(actionHref + '/invoke').then(function (actionInvocationResponse) {
              deferred.resolve(actionInvocationResponse);
            }, function (err) {
              console.log('invokeAction error: ', err);
            });
          // action has parameters, prompt user for input
          } else {
            var params = {};

            for (var parameter in actionResponse.data.parameters) {
              params[parameter] = prompt("Please enter parameter " + parameter + ":");
            }

            // invoke action with provided parameters
            actionHref += '/invoke?';
            var i = 0;
            var paramsLength = Object.keys(params).length;

            for (var param in params) {
              actionHref += param + '=' + params[param];

              i++;
              if (i != paramsLength) {
                actionHref += "&";
              }
            }

            $http.get(actionHref).then(function (actionInvocationResponse) {
              deferred.resolve(actionInvocationResponse);
            }, function (err) {
              console.log('invokeAction error: ', err);
            });
          }
        }, function (err) {
          console.log('invokeAction getActions error: ', err);
        });
      });

      return deferred.promise;
    }
  };

  return obj;
}]);