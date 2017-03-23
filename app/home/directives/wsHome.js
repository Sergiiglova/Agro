angular.module('wise.home')
    .directive('wsHome', function () {
    return {
        restrict: 'AE',
        scope: {
            data: '=ngModel',
            getDividingSum: '&'
        },
        templateUrl: 'app/home/views/home.html',
        controller: 'HomeCtrl',

        // TODO - recalculate plant
        link: function (scope) {
            scope.options = {width: 500, height: 300, 'bar': 'aaa'};


            scope.barValue = 'None';

            scope.data = {};
            data = scope.data;
            data.plantCrop = 25.6
            data.plantRadius = 12.45;
            data.radiusDividingCount = 20;
            data.dividingList = [];
            var rStep = data.plantRadius / data.radiusDividingCount;
            data.quarterPlantCrop = data.plantCrop / 4;
            scope.chartData = [];
            for (var i = 0; i < data.radiusDividingCount; i++) {
                var rStart = rStep * i;
                var rEnd = rStep * (i + 1);
                var s =Math.PI/4*(rEnd*rEnd -rStart*rStart);
                var value =
                    // Math.sqrt(data.plantRadius) -
                    Math.sqrt((i+1)*rStep);
                    // data.quarterPlantCrop / data.radiusDividingCount;
                scope.chartData.push(value);
                data.dividingList.push({
                    value: value,
                    rStep: rStep,
                    rStart: rStart,
                    rEnd: rEnd,
                    s: s,
                    destiny: value/s,
                    index: i,
                    title: "до " + Math.round(rStep * (i + 1)*100)/100 + " см."
                });

            }

            scope.recalc = function () {
                console.log("recalculated");
                data = scope.data;

                var rStep = data.plantRadius / data.radiusDividingCount;
                data.quarterPlantCrop = data.plantCrop / 4;

                if (data.radiusDividingCount != data.dividingList.length) {
                    for (var i = 0; i < data.radiusDividingCount; i++) {

                        var rStart = rStep * i;
                        var rEnd = rStep * (i + 1);
                        var s =Math.PI/4*(rEnd*rEnd -rStart*rStart);
                        var value = data.quarterPlantCrop / data.radiusDividingCount;
                        data.dividingList.push({
                            value: data.quarterPlantCrop / data.radiusDividingCount,
                            rStep: rStep,
                            rStart: rStart,
                            rEnd: rEnd,
                            s: s,
                            destiny: value/s,
                            index: i,
                            title: "до " + Math.round(rStep * (i + 1)*100)/100 + " см."
                        });
                    }
                }
            };

            scope.$watch('data.plantCrop', scope.recalc);

            scope.$watch('data.radiusDividingCount', scope.recalc);

            scope.getDividingSum = function () {
                var data = scope.data;
                var sum = 0;
                if (data.radiusDividingCount > 0) {
                    for (var i = 0; i < data.radiusDividingCount; i++) {
                        sum += data.dividingList[i].value;
                    }
                }
                return sum;
            };

            scope.alignDividing = function () {
                var data = scope.data;
                var sum = scope.getDividingSum();
                var percent = sum / data.quarterPlantCrop;

                if (data.radiusDividingCount > 0) {
                    for (var i = 0; i < data.radiusDividingCount; i++) {
                        data.dividingList[i].value = data.dividingList[i].value / percent;
                        data.dividingList[i].destiny =  data.dividingList[i].value/data.dividingList[i].s;
                    }
                }
            };

            scope.needAlign = function () {
                if (scope.data) {
                    return Math.abs(scope.getDividingSum() - scope.data.quarterPlantCrop) < 0.01;
                }
                return false;
            };
            scope.plantCalculate = function () {
                var yStep = 0.1;
                var xStep = 0.1;
                var ds = xStep * yStep;
                var data = scope.data;
                var r = data.plantRadius;
                var xLimits = [1.5, 2.35, 3.1, 5.1, 7.0, 10.4, 12.45];
                var results = [];
                for (var i = 0; i < xLimits.length; i++) {
                    var xLimit = xLimits[i];
                    var iX = 0;
                    var m = 0;
                    var s = 0;
                    while (iX < xLimit) {
                        var iY = 0;
                        var yLimit = Math.sqrt(r * r - iX * iX);
                        while (iY < yLimit) {
                            var x = iX + 0.5 * xStep;
                            var y = iY + 0.5 * yStep;
                            var r1 = Math.sqrt(x * x + y * y);
                            var m1 = ds * scope.getRoByValue(r1);
                            iY += yStep;
                            m+=m1;
                        }
                        iX += xStep;
                    }
                    results.push({x: xLimit, m: m * 4});
                }

                console.log(results);
            };
            scope.getRoByValue = function (r) {
                var data = scope.data;
                for (var i = 0; i < data.dividingList.length; i++) {
                   var  e = data.dividingList[i];
                    if ((e.rStart<r) && (e.rEnd>r)) {

                        return e.destiny;
                    }
                }
                return  data.dividingList[data.dividingList.length-1].destiny;
            }
        }
    }
})
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
                $scope.update = function(d, i){
                    $scope.chartData = randomData();
                };
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
    });