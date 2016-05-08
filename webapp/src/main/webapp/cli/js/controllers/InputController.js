app.controller('InputController',
  ['$scope', '$injector', '$rootScope', '$state',
    function ($scope, $injector, $rootScope, $state) {
      $scope.master = "";
      $scope.update = function () {
        $scope.master = $scope.inputfield;
        evaluateInput();
      };

      $scope.reset = function () {
        $scope.inputfield = "";
      };

      // focus always on input field
      var element = document.getElementById('clisis-input-field');
      if (element !== null) {
        element.focus();
        element.onblur = function () {
          setTimeout(function () {
            element.focus();
          });
        }
      }

      var evaluateInput = function () {
        //var $state = $injector.get('$state');
        var input = $scope.master.split(" ");

        switch (input[0]) {
          case "menus":
            $state.go('base.home');
            break;
          case "menu":
            if (input[1] === undefined) {
              throwError("Menu action requires a selection parameter");
              break;
            } else {
              var servicePresent = false;
              for (var service in $rootScope.services) {
                if ($rootScope.services[service].title.toUpperCase() === input[1].toUpperCase()) {
                  servicePresent = true;
                  $state.go('base.services', {"serviceId": service});
                  // go to service
                  break;
                }
              }

              if (servicePresent) {
                break;
              } else {
                // unknown menu item
                throwError("Menu \'" + input[1] + "\' not found");
                break;
              }
            }
          case undefined:
            break;
          default:
            break;
        }
      };

      var throwError = function (errorMessage) {
        $rootScope.errorMessage = errorMessage;
        if ($state.current.name === 'base.error') {
          $state.go('base.error', {}, {reload: true});
        } else {
          $state.go('base.error');
        }
      };
    }]);