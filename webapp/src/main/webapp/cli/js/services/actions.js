app.factory('actions', ['$http', '$q', 'services', '$resource', function ($http, $q, services, $resource) {
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

      var returnValue;

      // get services list
      services.getServices().then(function (servicesResponse) {
        // get actions for queried service
        return obj.getActions(servicesResponse.data.value[serviceId].href);
      }).then(function (actionsResponse) {
        // get invocation url for queried action
        var actionHref = actionsResponse.data.members[actionId].links[0].href;

        $resource(actionHref).get().$promise.then(function(actionResponse){

          // action has no parameters, continue with invocation
          if (Object.keys(actionResponse.parameters).length == 0) {
            $resource(actionHref + '/invoke').get().$promise.then(function (actionInvocationResponse) {
              deferred.resolve(actionInvocationResponse);
            }, function (err) {
              console.log('invokeAction error: ', err);
            });

          // action has parameters, prompt user for input
          } else {
            var params = {};

            for (var parameter in actionResponse.parameters) {
              // query input is a domain object
              if (actionResponse.parameters[parameter].hasOwnProperty("choices")) {
                console.log(actionResponse.parameters[parameter].choices);
                var choicesMsg = new Array("Enter number of desired choice:\n");
                actionResponse.parameters[parameter].choices.forEach(function (choice, i) {
                    if (typeof choice === 'object') {
                      choicesMsg.push(i.toString() + ": " + choice.title + "\n");
                    } else {
                      choicesMsg.push(i.toString() + ": " + choice + "\n");
                    }
                });

                var choice = prompt(choicesMsg.join(""));
                if (typeof actionResponse.parameters[parameter].choices[choice] === 'object') {
                  params[parameter] = {"value": {"href": actionResponse.parameters[parameter].choices[choice].href}};
                } else {
                  params[parameter] = {"value": actionResponse.parameters[parameter].choices[choice]};
                }

              // query input is a regular value
              } else {
                var input = prompt("Please enter parameter " + parameter + ":");
                params[parameter] = {"value": input};
              }
            }

            // invoke action with provided parameters
            var actionInvocation = $resource(actionHref + '/invoke?:queryString');
            actionInvocation.get({queryString: JSON.stringify(params)}, function(data) {
              console.log(data);
              deferred.resolve(data.$promise);
            });

            //$http.get(actionHref).then(function (actionInvocationResponse) {
            //  deferred.resolve(actionInvocationResponse);
            //}, function (err) {
            //  console.log('invokeAction error: ', err);
            //});
          }
        }, function (err) {
          console.log('invokeAction getActions error: ', err);
        });
      });

      return deferred.promise;
    },

    getObjectType: function(objectHref) {
      var objectTypeIndex = objectHref.lastIndexOf(".") + 1;
      var trimmed = objectHref.substring(objectTypeIndex, objectHref.indexOf("/", objectTypeIndex));

      return trimmed;
    }
  };

  return obj;
}]);