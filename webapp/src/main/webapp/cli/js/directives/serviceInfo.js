app.directive('serviceInfo', function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    template: '<p>{{info.title}}</p>'
  };
});