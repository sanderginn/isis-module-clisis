// http://stackoverflow.com/questions/15417125/submit-form-on-pressing-enter-with-angularjs

app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        if (element[0].id === "clisis-username") {
          document.querySelector("#clisis-password").focus();
        }
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter, {'event': event});
        });

        event.preventDefault();
      }
    });
  };
});