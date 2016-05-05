app.controller('ActionController',
  ['$scope', 'services', 'actions', '$stateParams', 'objects',
    function ($scope, services, actions, $stateParams, objects) {
      var parentType;
      var actionPromise;

      if ($stateParams.serviceId !== undefined) {
        parentType = "service";
      } else if ($stateParams.objectType !== undefined) {
        parentType = "object"
      }

      if (parentType === "service") {
        actionPromise = actions.invokeAction($stateParams.serviceId, $stateParams.actionId, parentType);
      } else if (parentType === "object") {
        actionPromise = actions.invokeObjectAction(objects.buildObjectHref($stateParams.objectType, $stateParams.objectId) + "/actions/" + $stateParams.actionId);
      }

      actionPromise.then(function (actionsResponse) {
        // action returned domain object
        if (actionsResponse.resulttype === "domainobject") {
          $scope.actionResults = {0: {"href": actionsResponse.result.links[0].href, "title": actionsResponse.result.title}};
          $scope.actionResults[0].objectType = objects.getObjectType($scope.actionResults[0].href);
          $scope.actionResults[0].objectId = objects.getObjectId($scope.actionResults[0].href);

          // action returned list
        } else if (actionsResponse.resulttype === "list") {
          $scope.actionResults = actionsResponse.result.value;

          // assign object type to all action results
          for (var actionResult in $scope.actionResults) {
            $scope.actionResults[actionResult].objectType = objects.getObjectType($scope.actionResults[actionResult].href);
            $scope.actionResults[actionResult].objectId = objects.getObjectId($scope.actionResults[actionResult].href);
          }
        }
      });
    }]);