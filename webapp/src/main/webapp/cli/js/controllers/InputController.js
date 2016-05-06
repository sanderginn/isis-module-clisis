app.controller('InputController',
  ['$scope',
    function ($scope) {
        var element = document.getElementById('clisis-input-field');
        if (element !== null) {
            element.focus();
            element.onblur = function () {
                setTimeout(function () {
                    element.focus();
                });
            }
        }
    }]);