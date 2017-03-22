angular.module('wise.home', []);

var app = angular.module('wise', ['ngMaterial', 'wise.home','angular-carousel','ngRoute', 'ngDialog'])
    .config(['$locationProvider', '$routeProvider','$mdThemingProvider',
        function ($locationProvider, $routeProvider, $mdThemingProvider) {
        $routeProvider
            // .when('/login', {
            //     templateUrl: 'app/user/views/login.html',
            //     controller: 'AuthCtrl'
            // })
            .when('/home', {
                template:
                    '<ws-home></ws-home>'


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
    }])

        .directive('barChart', function(){
            var chart = d3.custom.barChart();
            return {
                restrict: 'E',
                replace: true,
                template: '<div class="chart"></div>',
                scope:{
                    height: '=height',
                    data: '=data',
                    hovered: '&hovered'
                },
                link: function(scope, element, attrs) {
                    var chartEl = d3.select(element[0]);
                    chart.on('customHover', function(d, i){
                        scope.hovered({args:d});
                    });

                    scope.$watch('data', function (newVal, oldVal) {
                        chartEl.datum(newVal).call(chart);
                    });

                    scope.$watch('height', function(d, i){
                        chartEl.call(chart.height(scope.height));
                    })
                }
            }
        })
        .directive('chartForm', function(){
            return {
                restrict: 'E',
                replace: true,
                controller: function AppCtrl ($scope) {
                    $scope.update = function(d, i){ $scope.chartData = randomData(); };
                    function randomData(){
                        return d3.range(~~(Math.random()*50)+1).map(function(d, i){return ~~(Math.random()*1000);});
                    }
                },
                template: '<div class="form">' +
                'Height: {{options.height}}<br />' +
                '<input type="range" ng-model="options.height" min="100" max="800"/>' +
                '<br /><button ng-click="update()">Update Data</button>' +
                '<br />Hovered bar data: {{barValue}}</div>'
            }
        })
    ;

