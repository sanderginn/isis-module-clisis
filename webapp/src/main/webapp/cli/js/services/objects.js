app.factory('objects', ['$resource', '$q',
  function ($resource, $q) {
    var obj = {
      getObject: function (objectType, objectId) {
        var objectHref = obj.buildObjectHref(objectType, objectId);
        var deferred = $q.defer();

        $resource(objectHref).get().$promise.then(function (objectResponse) {
          deferred.resolve(objectResponse);
        });

        return deferred.promise;
      },

      buildObjectHref: function(objectType, objectId) {
        return window.location.origin + "/restful/objects/" + objectType + "/" + objectId;
      },

      getCollection: function (collectionHref) {
        var deferred = $q.defer();

        $resource(collectionHref).get().$promise.then(function (collectionResponse) {
          deferred.resolve(collectionResponse);
        });

        return deferred.promise;
      },

      getObjectType: function (objectHref) {
        var searchString = "/objects/";
        var objectTypeIndex = objectHref.search(searchString) + searchString.length;

        return objectHref.slice(objectTypeIndex, objectHref.lastIndexOf("/"));
      },

      getObjectId: function (objectHref) {
        return objectHref.substring(objectHref.lastIndexOf("/") + 1);
      }
    };

    return obj;
  }]);