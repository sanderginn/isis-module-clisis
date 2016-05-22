app.factory('actions', ['$http', '$q', 'services', '$resource', 'errorService',
  function ($http, $q, services, $resource, errorService) {
  var obj = {

    getActions: function (serviceHref) {
      var deferred = $q.defer();

      $http.get(serviceHref)
        .then(function (data) {
          deferred.resolve(data);
        }, function (err) {
          errorService.throwError(err.data["x-ro-invalidReason"]);
        });

      return deferred.promise;
    },

    invokeAction: function (serviceHref, actionId, parameters) {
      // get actions for queried service
      return obj.getActions(serviceHref).then(function (actionsResponse) {
        // get invocation url for queried action
        var actionHref = actionsResponse.data.members[actionId].links[0].href;
        return obj.invokeObjectAction(actionHref, parameters);
      });
    },

    invokeObjectAction: function (objectActionHref, parameters) {
      var deferred = $q.defer();
      var useGet = true;

      $resource(objectActionHref).get().$promise.then(function (actionResponse) {

        // action has no parameters, continue with invocation
        if (Object.keys(parameters).length == 0) {
          $resource(objectActionHref + '/invoke').get().$promise.then(function (actionInvocationResponse) {
            deferred.resolve(actionInvocationResponse);
          }, function (err) {
            errorService.throwError(err.data["x-ro-invalidReason"]);
          });

          // action has parameters, prompt user for input
        } else {
          useGet = (actionResponse.extensions.actionSemantics === "safe");

          // invoke action with provided parameters
          var actionInvocation;
          if (useGet) {
            actionInvocation = $resource(objectActionHref + '/invoke?:queryString');
            actionInvocation.get({queryString: JSON.stringify(parameters)}, function (data) {
              deferred.resolve(data.$promise);
            }, function(err) {
              errorService.throwError(JSON.stringify(err));
            });
          } else {
            actionInvocation = $resource(objectActionHref + '/invoke');
            actionInvocation.save(parameters, function (data) {
              deferred.resolve(data.$promise);
            }, function (err) {
              errorService.throwError(err.data["x-ro-invalidReason"]);
            });
          }
        }
      }, function (err) {
        errorService.throwError(err.data["x-ro-invalidReason"]);
      });

      return deferred.promise;
    },

    getActionParams: function (objectActionHref) {
      var deferred = $q.defer();

      $resource(objectActionHref).get().$promise.then(function (result) {
        if (Object.keys(result.parameters).length === 0) {
          deferred.resolve({});
        } else {
          deferred.resolve(result.parameters);
        }
      });

      return deferred.promise;
    }
  };

  return obj;
}]);