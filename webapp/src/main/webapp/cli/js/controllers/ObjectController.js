app.controller('ObjectController',
  ['$scope', '$stateParams', 'objects', '$q', '$rootScope', 'rootScopeSanitiser', 'errorService',
    function ($scope, $stateParams, objects, $q, $rootScope, rootScopeSanitiser, errorService) {
      $scope.showProperties = false;
      $scope.showCollections = false;
      $scope.showActions = false;

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
            errorService.throwError("Unknown memberType " + member.memberType);
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
          $rootScope.collections = angular.copy($scope.collections);
        });

        $rootScope.domainType = angular.copy($scope.domainType);
        $rootScope.instanceId = angular.copy($scope.instanceId);
        $rootScope.title = angular.copy($scope.title);

        $rootScope.properties = angular.copy($scope.properties);
        $rootScope.actions = angular.copy($scope.actions);
        rootScopeSanitiser.sanitiseRootScope(['domainType', 'instanceId', 'title', 'properties', 'collections', 'actions', 'services']);

      });

      $scope.typeOf = function(val) {
        return typeof val;
      };

      $scope.$on('$showProperties', function() {
        $scope.showProperties = true;
        $scope.showCollections = false;
        $scope.showActions = false;
      });

      $scope.$on('$showCollections', function() {
        $scope.showCollections = true;
        $scope.showProperties = false;
        $scope.showActions = false;
      });

      $scope.$on('$showActions', function() {
        $scope.showActions = true;
        $scope.showProperties = false;
        $scope.showCollections = false;
      });
    }]);