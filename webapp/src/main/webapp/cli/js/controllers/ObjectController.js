app.controller('ObjectController',
  ['$scope', '$stateParams', 'objects', '$q',
    function ($scope, $stateParams, objects, $q) {
      objects.getObject($stateParams.objectType, $stateParams.objectId).then(function (objectResponse) {
        $scope.domainType = objectResponse.domainType;
        $scope.instanceId = objectResponse.instanceId;
        $scope.title = objectResponse.title;

        $scope.properties = {};
        $scope.collections = {};
        $scope.actions = {};

        var collectionPromises = [];

        for (var member in objectResponse.members) {
          if (objectResponse.members[member].memberType === "property") {
            $scope.properties[member] = objectResponse.members[member];
          } else if (objectResponse.members[member].memberType === "collection") {
            collectionPromises.push(objects.getCollection(objectResponse.members[member].links[0].href));
          } else if (objectResponse.members[member].memberType === "action") {
            $scope.actions[member] = objectResponse.members[member];
          } else {
            console.log("Unknown memberType: ", member.memberType);
          }
        }

        $q.all(collectionPromises).then(function (collectionResponses) {
          for (var collectionResponse in collectionResponses) {
            $scope.collections[collectionResponses[collectionResponse].id] = collectionResponses[collectionResponse].value;
            for (var col in $scope.collections[collectionResponses[collectionResponse].id]) {
              $scope.collections[collectionResponses[collectionResponse].id][col].objectType = objects.getObjectType($scope.collections[collectionResponses[collectionResponse].id][col].href);
              $scope.collections[collectionResponses[collectionResponse].id][col].objectId = objects.getObjectId($scope.collections[collectionResponses[collectionResponse].id][col].href);
            }
          }
        });
      });

      console.log($scope);
    }]);