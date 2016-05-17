app.controller('InputController',
  ['$scope', '$injector', '$rootScope', '$state', '$filter', 'actions', 'objects', 'errorService', '$stateParams', 'speechService', '$timeout',
    function ($scope, $injector, $rootScope, $state, $filter, actions, objects, errorService, $stateParams, speechService, $timeout) {

      $scope.master = "";
      $scope.update = function () {
        $scope.master = $scope.inputfield;
        if ($scope.master !== undefined && $scope.master !== "") {
          speechService.cancelSpeech();
          speechService.speak("Input: " + $scope.master);
          evaluateInput();
        }
      };

      $scope.reset = function () {
        $scope.inputfield = "";
      };

      var evaluateInput = function () {
        var input = $scope.master.split(" ");

        switch (input[0].toLowerCase()) {

          /*************
          * LIST MENUS *
          *************/
          case "menus":
            $state.go('base.home');
            break;

          /**************
          * SELECT MENU *
          **************/
          case "menu":

            // no menu parameter provided
            if (input[1] === undefined) {
              errorService.throwError("Opening menu requires a selection parameter");
              break;
            } else if (isInt(input[1])) {
              var index = parseInt(input[1]);
              if (index >= Object.keys($rootScope.services).length) {
                errorService.throwError("Index out of range");
              } else {
                $state.go('base.services', {"serviceId": index});
              }
            } else {
              var menuParam = input.slice(1).join(" ");
              var servicePresent = false;

              for (var service in $rootScope.services) {
                if ($rootScope.services[service].title.toLowerCase() === menuParam) {
                  servicePresent = true;

                  $state.go('base.services', {"serviceId": service});
                  break;
                }
              }

              if (servicePresent) {
                break;
              } else {
                // unknown menu item
                errorService.throwError("Menu \'" + menuParam + "\' not found");
                break;
              }
            }

          /***************
          * LIST ACTIONS *
          ***************/
          case "actions":
            console.log($rootScope.actions);
            $rootScope.$broadcast('$showActions');
            break;

          /****************
          * INVOKE ACTION *
          ****************/
          case "action":
            // actions are only available on services and objects
            if ($state.current.name !== "base.services" && $state.current.name !== "base.object") {
              break;
            }

            // no action parameter provided
            if (input[1] === undefined) {
              errorService.throwError("Invoking action requires a selection parameter");
              break;
            } else {
              var actionParam = input[1];
              var actionPresent = false;

              for (var action in $rootScope.actions) {
                if ($rootScope.actions[action].id.toLowerCase() === actionParam) {
                  actionPresent = true;

                  actions.getActionParams($rootScope.actions[action].links[0].href).then(function (paramData) {

                    // action has no parameters, invoke
                    if (Object.keys(paramData).length === 0) {
                      if ($rootScope.hasOwnProperty('serviceId')) {
                        $state.go('base.serviceAction',
                          {
                            "serviceId": $rootScope.serviceId,
                            "actionId": action,
                            "params": JSON.stringify({})
                          }
                        );
                      } else {
                        $state.go('base.objectAction',
                          {
                            "objectType": $rootScope.domainType,
                            "objectId": $rootScope.instanceId,
                            "actionId": action
                          }
                        );
                      }

                    // action has parameters, ask user for input
                    } else {
                      if ($rootScope.hasOwnProperty('serviceId')) {
                        $state.go('base.serviceActionParams',
                          {
                            "serviceId": $rootScope.serviceId,
                            "actionId": action,
                            "parameters": JSON.stringify(paramData)
                          }
                        );
                      } else {
                        $state.go('base.objectActionParams',
                          {
                            "objectType": $rootScope.domainType,
                            "objectId": $rootScope.instanceId,
                            "actionId": action,
                            "parameters": JSON.stringify(paramData)
                          }
                        );
                      }
                    }
                  });
                  break;
                }
              }

              if (actionPresent) {
                break;
              } else {
                // unknown action
                errorService.throwError("Action \'" + actionParam + "\' not found");
                break;
              }
            }

          /*****************
          * FILL OUT FIELD *
          *****************/
          case "field":

            // fields are only available on action parameters
            if ($state.current.name !== "base.serviceActionParams" && $state.current.name !== "base.objectActionParams") {
              break;
            }

            if (input[1] === undefined || input[2] === undefined) {
              errorService.throwError("Filling out a field requires a selection and value parameter");
              break;
            } else {
              if (!isInt(input[1])) {
                errorService.throwError("Selection parameter must be an integer");
                break;
              } else {
                $rootScope.$broadcast('$fieldInputEvent', {"fieldId": input[1], "fieldValue": input.slice(2).join(" ")});
                break;
              }
            }

          /*********************
          * CONFIRM PARAMETERS *
          *********************/
          case "submit":

            // submit is only available on action parameters
            if ($state.current.name !== "base.serviceActionParams" && $state.current.name !== "base.objectActionParams") {
              break;
            }

            for (var parameter in $rootScope.parameters) {
              if ($rootScope.parameters[parameter].hasOwnProperty('choices')) {
                var choice = $rootScope.parameters[parameter].value;

                if (choice === null) {
                  $rootScope.parameters[parameter].value = null;
                } else if (typeof $rootScope.parameters[parameter].choices[choice] === 'object') {
                  $rootScope.parameters[parameter].value = {"href": $rootScope.parameters[parameter].choices[choice].href };
                } else {
                  $rootScope.parameters[parameter].value = $rootScope.parameters[parameter].choices[choice];
                }
              }
            }

            // submitted without filling out any fields, this ensures invalidation message is returned
            if ($rootScope.actionId === undefined && $rootScope.parameters === undefined) {
              $rootScope.actionId = $stateParams.actionId;
              $rootScope.parameters = {};
            }

            if ($rootScope.hasOwnProperty('serviceId')) {
              $state.go('base.serviceAction',
                {
                  "serviceId": $rootScope.serviceId,
                  "actionId": $rootScope.actionId,
                  "params": JSON.stringify($rootScope.parameters)
                }
              );
            } else if ($rootScope.hasOwnProperty('objectType')) {
              $state.go('base.objectAction',
                {
                  "objectType": $rootScope.objectType,
                  "domainType": $rootScope.domainType,
                  "objectId": $rootScope.objectId,
                  "actionId": $rootScope.actionId,
                  "params": JSON.stringify($rootScope.parameters)
                }
              );
            }
            break;

          /****************
          * GET OBJECT(S) *
          ****************/
          case "get":
            if (input[1] === undefined) {
              errorService.throwError("Get object requires a selection parameter");
              break;
            } else {
              if (isInt(input[1])) {
                var index = parseInt(input[1]);

                if ($state.current.name === "base.collection") {
                  if (index >= Object.keys($rootScope.actionResults).length) {
                    errorService.throwError("Index out of range");
                  } else {
                    $state.go('base.object',
                      {
                        "objectType": $rootScope.actionResults[index].objectType,
                        "objectId": $rootScope.actionResults[index].objectId,
                        "backIndex": -2
                      }
                    );
                  }
                }
              } else {
                var getParam = input.slice(1).join(" ").toLowerCase();

                if ($state.current.name === "base.collection") {
                  var filter = $filter('filter');
                  $rootScope.filteredActionResults = filter($rootScope.actionResults, {"title": getParam});

                  // no results
                  if ($rootScope.filteredActionResults.length === 0) {
                    errorService.throwError("Object \'" + getParam + "\' not found");
                    break;

                    // single result
                  } else if ($rootScope.filteredActionResults.length === 1) {
                    $state.go('base.object',
                      {
                        "objectType": $rootScope.filteredActionResults[0].objectType,
                        "objectId": $rootScope.filteredActionResults[0].objectId,
                        "backIndex": -2
                      }
                    );

                    break;

                    // multiple results
                  } else {
                    $state.go('base.collection', {"actionResults": $rootScope.filteredActionResults, "backIndex": -2});
                    break;
                  }
                } else if ($state.current.name === "base.object") {
                  var keyFound = false;

                  for (var key in $rootScope.properties) {
                    if (key.toLowerCase() === getParam) {
                      keyFound = true;

                      var objectType = objects.getObjectType($rootScope.properties[key].value.href);
                      var objectId = objects.getObjectId($rootScope.properties[key].value.href);

                      $state.go('base.object',
                        {
                          "objectType": objectType,
                          "objectId": objectId,
                          "backIndex": -2
                        }
                      );
                      break;
                    }
                  }

                  if (keyFound === false) {
                    for (var key in $rootScope.collections) {
                      if (key.toLowerCase() === getParam) {
                        keyFound = true;
                        $state.go('base.collection', {"actionResults": $rootScope.collections[key], "backIndex": -2});
                        break;
                      }
                    }
                  }
                }
              }

              break;
            }

          /**************************
          * SHOW COLLECTION RESULTS *
          **************************/
          case "show":
            if (input[1] === undefined) {
              $rootScope.$broadcast('$showCollectionResults');
            } else if (input[1].toLowerCase() === "next") {
              $rootScope.$broadcast('$showNextCollectionResults');
            } else if (input[1].toLowerCase() === "previous") {
              $rootScope.$broadcast('$showPreviousCollectionResults');
            }

            break;

          /******************
          * LIST PROPERTIES *
          ******************/
          case "properties":
            $rootScope.$broadcast('$showProperties');
            break;

          /*******************
          * LIST COLLECTIONS *
          *******************/
          case "collections":
            $rootScope.$broadcast('$showCollections');
            break;

          /*******************
          * GO BACK ONE STEP *
          *******************/
          case "back":

            // Collections and actions use POST parameters, so skip invocations to prevent errors
            if ($stateParams.hasOwnProperty('backIndex')) {
              window.history.go($stateParams.backIndex);
            } else {
              window.history.back();
            }
            break;

          /**********************
          * GO FORWARD ONE STEP *
          **********************/
          case "forward":
            window.history.forward();
            break;

          /*****************
          * LIST HELP MENU *
          *****************/
          case "help":
            $state.go('base.help', {"previousState": $state.current.name}).then(function() {
              $timeout(function() {
                speechService.speak("Output: " + document.getElementById("clisis-output").innerText);
              }, 0);
            });
            break;

          /*******************
          * EXIT APPLICATION *
          *******************/
          case "quit":
            var AuthService = $injector.get("AuthService");
            AuthService.logout();
            $state.go("base.login");
            break;

          case "listen":
            speechService.listen();
            break;

          /**********************
          * ENTER WITHOUT INPUT *
          **********************/
          case undefined:
            break;
          default:
            break;
        }
      };

      // focus always on input field
      var element = document.getElementById('clisis-input-field');
      if (element !== null) {
        element.focus();
        element.onblur = function () {
          setTimeout(function () {
            element.focus();
          }, 0);
        }
      }

      function isInt(value) {
        return !isNaN(value) &&
          parseInt(Number(value)) == value &&
          !isNaN(parseInt(value, 10));
      }

      function checkKeyPress(e) {
        if (e.keyCode === 9) {
          e.preventDefault();
        } else if (e.keyCode === 27) {
          speechService.cancelSpeech();
        }
      }

      document.addEventListener('keydown', function (e) {
        checkKeyPress(e);
      }, false);

    }]);