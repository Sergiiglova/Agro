angular.module('wise.home', []);

var app = angular.module('wise', ['wise.home','angular-carousel', 'ngMaterial', 'ngRoute', 'ngDialog'])
    .config(['$locationProvider', '$routeProvider','$mdThemingProvider', function ($locationProvider, $routeProvider, $mdThemingProvider) {
        $routeProvider
            // .when('/login', {
            //     templateUrl: 'app/user/views/login.html',
            //     controller: 'AuthCtrl'
            // })
            .when('/home', {
                template: '<ws-home></ws-home>'
            })
            // .when('/tactic', {
            //     template: '<ws-tactic></ws-tactic>'
            // })
            // .when('/vision', {
            //     template: '<ws-vision></ws-vision>'
            // })
            // .when('/calendar', {
            //     template: '<ws-calendar></ws-calendar>'
            // })
            // .when('/resource', {
            //     template: '<ws-resource></ws-resource>'
            // })
            // .when('/market', {
            //     template: '<ws-market></ws-market>'
            // })
            // .when('/market/:programId', {
            //     template: '<ws-program-details></ws-program-details>'
            // })
            .otherwise({
                redirectTo: '/home'
            });
    }]);

