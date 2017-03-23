angular.module('wise.home', []);

var app = angular.module('wise', ['ngMaterial', 'wise.home', 'angular-carousel', 'ngRoute', 'ngDialog'])
    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider',
        function ($locationProvider, $routeProvider, $mdThemingProvider) {
            $routeProvider
            // .when('/login', {
            //     templateUrl: 'app/user/views/login.html',
            //     controller: 'AuthCtrl'
            // })
                .when('/home', {
                    template: '<ws-home></ws-home>'


                })
                .when('/experiment', {
                    // template:
                    templateUrl: 'app/experiment/views/experiment.html',
                    title: 'эксперимент'

                })
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

            $mdThemingProvider.theme('default');

        }])


;

