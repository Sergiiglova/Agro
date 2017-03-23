angular.module('wise.home', ['d3'])
    .directive('wsHome', function () {
        return {
            restrict: 'AE',
            scope: {
                data: '=ngModel',
                getDividingSum: '&',
                pages: '=',
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
                    var s = Math.PI / 4 * (rEnd * rEnd - rStart * rStart);
                    var value =
                        // Math.sqrt(data.plantRadius) -
                        Math.sqrt((i + 1) * rStep);
                    // data.quarterPlantCrop / data.radiusDividingCount;
                    scope.chartData.push(value);
                    data.dividingList.push({
                        value: value,
                        rStep: rStep,
                        rStart: rStart,
                        rEnd: rEnd,
                        s: s,
                        destiny: value / s,
                        index: i,
                        title: "до " + Math.round(rStep * (i + 1) * 100) / 100 + " см."
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
                            var s = Math.PI / 4 * (rEnd * rEnd - rStart * rStart);
                            var value = data.quarterPlantCrop / data.radiusDividingCount;
                            data.dividingList.push({
                                value: data.quarterPlantCrop / data.radiusDividingCount,
                                rStep: rStep,
                                rStart: rStart,
                                rEnd: rEnd,
                                s: s,
                                destiny: value / s,
                                index: i,
                                title: "до " + Math.round(rStep * (i + 1) * 100) / 100 + " см."
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
                            data.dividingList[i].destiny = data.dividingList[i].value / data.dividingList[i].s;
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
                                m += m1;
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
                        var e = data.dividingList[i];
                        if ((e.rStart < r) && (e.rEnd > r)) {

                            return e.destiny;
                        }
                    }
                    return data.dividingList[data.dividingList.length - 1].destiny;
                }
            }
        }
    })

    .directive('d3Bars', ['$window', '$timeout', 'd3Service',
        function ($window, $timeout, d3Service) {
            return {
                restrict: 'EA',
                scope: {},
                link: function (scope, element, attrs) {
                    d3Service.d3().then(function(d3) {

                        var svg = d3.select("svg"),
                            width = +svg.attr("width"),
                            height = +svg.attr("height"),
                            radius = 15;

                        var circles = d3.range(30).map(function () {
                            return {
                                x: Math.round(Math.random() * (width - radius * 2) + radius),
                                y: Math.round(Math.random() * (height - radius * 2) + radius)
                            };
                        });

                        var color = d3.scaleOrdinal()
                            .range(d3.schemeCategory20);

                        var voronoi = d3.voronoi()
                            .x(function (d) {
                                return d.x;
                            })
                            .y(function (d) {
                                return d.y;
                            })
                            .extent([[-1, -1], [width + 1, height + 1]]);

                        var circle = svg.selectAll("g")
                            .data(circles)
                            .enter().append("g")
                            .call(d3.drag()
                                .on("start", dragstarted)
                                .on("drag", dragged)
                                .on("end", dragended));

                        var cell = circle.append("path")
                            .data(voronoi.polygons(circles))
                            .attr("d", renderCell)
                            .attr("id", function (d, i) {
                                return "cell-" + i;
                            });

                        circle.append("clipPath")
                            .attr("id", function (d, i) {
                                return "clip-" + i;
                            })
                            .append("use")
                            .attr("xlink:href", function (d, i) {
                                return "#cell-" + i;
                            });

                        circle.append("circle")
                            .attr("clip-path", function (d, i) {
                                return "url(#clip-" + i + ")";
                            })
                            .attr("cx", function (d) {
                                return d.x;
                            })
                            .attr("cy", function (d) {
                                return d.y;
                            })
                            .attr("r", radius)
                            .style("fill", function (d, i) {
                                return color(i);
                            });

                        circle.on("click", function(d){
                            testClick(d);
                        });

                        function testClick(d) {
                            console.log("ebanko");
                        }

                        function dragstarted(d) {
                            d3.select(this).raise().classed("active", true);
                        }

                        function dragged(d) {
                            d3.select(this).select("circle").attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
                            cell = cell.data(voronoi.polygons(circles)).attr("d", renderCell);
                        }

                        function dragended(d, i) {
                            d3.select(this).classed("active", false);
                        }

                        function renderCell(d) {
                            return d == null ? null : "M" + d.join("L") + "Z";
                        }






                        //
                        // var renderTimeout;
                        // var margin = parseInt(attrs.margin) || 20,
                        //     barHeight = parseInt(attrs.barHeight) || 20,
                        //     barPadding = parseInt(attrs.barPadding) || 5;
                        //
                        // var svg = d3.select(element[0])
                        //     .append('svg')
                        //     .style('width', '100%');
                        //
                        // $window.onresize = function() {
                        //     scope.$apply();
                        // };
                        //
                        // scope.$watch(function() {
                        //     return angular.element($window)[0].innerWidth;
                        // }, function() {
                        //     scope.render(scope.data);
                        // });
                        //
                        // scope.$watch('data', function(newData) {
                        //     scope.render(newData);
                        // }, true);
                        //
                        //
                        // scope.render = function(data) {
                        //     svg.selectAll('*').remove();
                        //
                        //     // if (!data) {
                        //         scope.data = [
                        //         {name: "Greg", score: 98},
                        //         {name: "Ari", score: 96},
                        //         {name: 'Q', score: 75},
                        //         {name: "Loser", score: 48}
                        //         ]
                        //     // }
                        //     if (renderTimeout) clearTimeout(renderTimeout);
                        //
                        //     renderTimeout = $timeout(function () {
                        //         var width = d3.select(element[0])[0][0].offsetWidth - margin,
                        //             height = scope.data.length * (barHeight + barPadding),
                        //             color = d3.scale.category20(),
                        //             xScale = d3.scale.linear()
                        //                 .domain([0, d3.max(data, function (d) {
                        //                     return d.score;
                        //                 })])
                        //                 .range([0, width]);
                        //
                        //         svg.attr('height', height);
                        //
                        //         svg.selectAll('rect')
                        //             .data(data)
                        //             .enter()
                        //             .append('rect')
                        //             .on('click', function (d, i) {
                        //                 return scope.onClick({item: d});
                        //             })
                        //             .attr('height', barHeight)
                        //             .attr('width', 140)
                        //             .attr('x', Math.round(margin / 2))
                        //             .attr('y', function (d, i) {
                        //                 return i * (barHeight + barPadding);
                        //             })
                        //             .attr('fill', function (d) {
                        //                 return color(d.score);
                        //             })
                        //             .transition()
                        //             .duration(1000)
                        //             .attr('width', function (d) {
                        //                 return xScale(d.score);
                        //             });
                        //         svg.selectAll('text')
                        //             .data(data)
                        //             .enter()
                        //             .append('text')
                        //             .attr('fill', '#fff')
                        //             .attr('y', function (d, i) {
                        //                 return i * (barHeight + barPadding) + 15;
                        //             })
                        //             .attr('x', 15)
                        //             .text(function (d) {
                        //                 return d.name + " (scored: " + d.score + ")";
                        //             });
                        //     }, 200);
                        // }
                    });
                }
            };
        }])
    .directive('barChart', function () {
        var chart = d3.custom.barChart();
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="chart"></div>',
            scope: {
                height: '=height',
                data: '=data',
                hovered: '&hovered'
            },
            link: function (scope, element, attrs) {
                var chartEl = d3.select(element[0]);
                chart.on('customHover', function (d, i) {
                    scope.hovered({args: d});
                });

                scope.$watch('data', function (newVal, oldVal) {
                    chartEl.datum(newVal).call(chart);
                });

                scope.$watch('height', function (d, i) {
                    chartEl.call(chart.height(scope.height));
                })
            }
        }
    })
    .directive('chartForm', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: function AppCtrl($scope) {
                $scope.update = function (d, i) {
                    $scope.chartData = randomData();
                };
                function randomData() {
                    return d3.range(~~(Math.random() * 50) + 1).map(function (d, i) {
                        return ~~(Math.random() * 1000);
                    });
                }
            },
            template: '<div class="form">' +
            'Height: {{options.height}}<br />' +
            '<input type="range" ng-model="options.height" min="100" max="800"/>' +
            '<br /><button ng-click="update()">Update Data</button>' +
            '<br />Hovered bar data: {{barValue}}</div>'
        }
    });