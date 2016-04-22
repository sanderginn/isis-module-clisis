app.directive('serviceInfo', function() {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    template: '<a href="#/services/{{$index}}"><h3>{{info.title}}</h3></a>'
  };
});