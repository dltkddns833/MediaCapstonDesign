var Myapp = angular.module('Myapp',[   
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'color.picker',
    'core',

    // Route
    'main',
    'capstonCanvas',
]).
config(function($routeProvider, $locationProvider){
    $locationProvider.hashPrefix('!');
    $routeProvider.
    // when('/',{
    //     controller : 'Mycontroller',
    //     templateurl : 'index.html',
    // }).
    when('/main',{
        template : '<main></main>'
    }).
    otherwise({redirectTo: '/main'});
});

Myapp.controller('Mycontroller', function($scope, $state){
    $scope.state = $state;
    console.log($scope.state);
});