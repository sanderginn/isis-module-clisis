app.controller('ActionController',
  ['$scope', 'services', 'actions', '$stateParams', 'objects', '$rootScope', 'rootScopeSanitiser', '$state',
    function ($scope, services, actions, $stateParams, objects, $rootScope, rootScopeSanitiser, $state) {
      var parentType;
      var actionPromise;

      if ($stateParams.serviceId !== undefined) {
        parentType = "service";
      } else if ($stateParams.objectType !== undefined) {
        parentType = "object"
      }

      var actionParams = JSON.parse($stateParams.params);

      if (parentType === "service") {
        actionPromise = actions.invokeAction($stateParams.serviceId, $stateParams.actionId, actionParams);
      } else if (parentType === "object") {
        actionPromise = actions.invokeObjectAction(objects.buildObjectHref($stateParams.objectType, $stateParams.objectId) + "/actions/" + $stateParams.actionId, actionParams);
      }

      actionPromise.then(function (actionsResponse) {
        // action returned domain object
        if (actionsResponse.resulttype === "domainobject") {
          $state.go('base.object',
            {
              "objectType": objects.getObjectType(actionsResponse.result.links[0].href),
              "objectId": objects.getObjectId(actionsResponse.result.links[0].href)
            });

          // action returned list
        } else if (actionsResponse.resulttype === "list") {
          var actionResults = actionsResponse.result.value;

          if (actionResults.length === 1) {
            $state.go('base.object',
              {
                "objectType": objects.getObjectType(actionResults[0].href),
                "objectId": objects.getObjectId(actionResults[0].href)
              });
          } else {
            // assign object type to all action results
            for (var actionResult in actionResults) {
              actionResults[actionResult].objectType = objects.getObjectType(actionResults[actionResult].href);
              actionResults[actionResult].objectId = objects.getObjectId(actionResults[actionResult].href);
            }

            $state.go('base.collection', {"actionResults": actionResults});
          }
        }

        $rootScope.actionResults = angular.copy(actionResults);
        rootScopeSanitiser.sanitiseRootScope(['actionResults', 'services']);
      });
    }]);