angular.module('wise.home', []);
angular.module('d3', [])
    .factory('d3Service', ['$document', '$window', '$q', '$rootScope',
        function ($document, $window, $q, $rootScope) {
            var d = $q.defer(),
                d3service = {
                    d3: function () {
                        return d.promise;
                    }
                };

            function onScriptLoad() {
                // Load client in the browser
                $rootScope.$apply(function () {
                    d.resolve($window.d3);
                });
            }

            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = '/Agro/lib/d3.js';
            scriptTag.onreadystatechange = function () {
                if (this.readyState == 'complete') onScriptLoad();
            };
            scriptTag.onload = onScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);

            return d3service;
        }]);
var app = angular.module('wise', ['ngMaterial', 'wise.home', 'angular-carousel', 'ngRoute', 'ngDialog','d3'])
    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider',
        function ($locationProvider, $routeProvider, $mdThemingProvider) {

        $routeProvider
            // .when('/login', {
            //     templateUrl: 'app/user/views/login.html',
            //     controller: 'AuthCtrl'
            // })
                .when('/home', {

                    template: '<ws-home pages="pages"></ws-home>'

                })
                // .when('/experiment', {
                //     // template:
                //     templateUrl: 'app/experiment/views/experiment.html',
                //     title: 'эксперимент'
                //
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

            $mdThemingProvider.theme('default');

        }])
;

