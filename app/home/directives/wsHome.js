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
                scope.sow = function () {

                };

                scope.test = function () {
                    data.k = 2.3
                    data.precision = 20;
                    var dx = dy = (data.plantRadius / data.precision);

                    data.oppression = [[]];
                    var j = 0;
                    for (var i = 0; i < data.precision; i++) {
                        var x = dx * (i + 1);
                        var value1 = 6.14321 - 2.30628 * Math.log(x - dx);
                        var value2 = 6.14321 - 2.30628 * Math.log(x + dx);
                        var value = value1 - value2;
                        data.oppression[i] = {};
                        data.oppression[i][j] = {
                            dxUgnet: value,
                            x: x,
                            jCount: Math.round(Math.sqrt(data.plantRadius * data.plantRadius - x * x) / dy),
                            i: i
                        }
                        ;
                        console.log(i + "{" + x + "," + data.oppression[i][j].dxUgnet + "}" + "jcount" + data.oppression[i][j].jCount);
                        console.log();
                    }
                    var dy = dx;

                    // var i = data.precision;
                    // var x = dx * (i + 1);
                    // var hvostIntegrala = data.k / x;
                    // console.log("hvost" + hvostIntegrala)
                    // for (var i = 0; i < data.precision; i++) {
                    //     var x = dx * (i + 1);
                    //     data.mainOppression[i] = data.mainOppression[i] - hvostIntegrala;
                    //     console.log("{" + x + "," + data.mainOppression[i] + "}");
                    //     console.log();
                    // }


                };


                scope.options = {width: 500, height: 300, 'bar': 'aaa'};


                scope.barValue = 'None';

                scope.data = {};
                data = scope.data;
                data.plantCrop = 25.6
                data.plantRadius = 12.45;
                data.radiusDividingCount = 20;


                scope.data.dividingList = [];
                var rStep = data.plantRadius / data.radiusDividingCount;
                data.quarterPlantCrop = data.plantCrop / 4;
                scope.chartData = [];
                for (var i = 0; i < data.radiusDividingCount; i++) {
                    var rStart = rStep * i;
                    var rEnd = rStep * (i + 1);
                    var s = Math.PI / 4 * (rEnd * rEnd - rStart * rStart);
                    var value =
                        4.5 + (i + 1) * rStep / 2
                    // Math.sqrt(data.plantRadius) -
                    // Math.sqrt((i + 1) * rStep);
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

                scope.test();
                scope.initializeCropData = function () {
                    var cropData = scope.cropData = {};
                    cropData.cropTypes = [{name: "Рядками", value: "rows"}, {
                        name: "Будь як",
                        value: "random"
                    }, {name: "Квадратний", value: "square"}, {name: "Гексагоном", value: "hexagon"}];
                    cropData.cropType = cropData.cropTypes[0].value;
                    cropData.rowSpace = 12;
                    cropData.columnSpace = 5;
                    cropData.plantData = scope.data;
                };

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
                scope.initializeCropData();
            }
        }
    })

    .directive('d3Bars', ['$window', '$timeout', 'd3Service',
        function ($window, $timeout, d3Service) {
            return {
                restrict: 'EA',
                scope: {
                    cropData: '=ngModel',

                },
                link: function (scope, element, attrs) {
                    d3Service.d3().then(function (d3) {
                        var width = 1900,
                            height = 1200;

                        var svg = d3.select("#chart")
                            .append('svg')
                            .attr("width", width)
                            .attr("height", height)
                            .style('width', '100%');

                        var cropData = scope.cropData;
                        var plantData = cropData.plantData;


                            // TODO - radius at sm
                        var mmInPixel = 1;
                        var mmFieldWidth = width * mmInPixel;
                        var mmFieldHeight = height * mmInPixel;
                        var smToMM = 10;
                        var mmRadius = plantData.plantRadius*smToMM;
                        var circles = [];


                        switch (cropData.cropType) {
                            case "rows":
                                var y = 0.5 * cropData.rowSpace*smToMM; // отступ от краев
                                while (y < mmFieldHeight) {
                                    var x = 0.5 * cropData.columnSpace+smToMM;
                                    while (x < mmFieldWidth) {
                                        circles.push({x: x, y: y})
                                        x += cropData.columnSpace*smToMM;
                                    }
                                    y += cropData.rowSpace*smToMM;
                                }
                                break;
                            case "square":
                                break;
                            case "hexagon":
                                break;

                            case "random":
                            default:
                                circles = d3.range(200).map(function () {
                                    return {
                                        x: Math.round(Math.random() * (mmFieldWidth - mmRadius * 20) + mmRadius),
                                        y: Math.round(Math.random() * (mmFieldHeight - mmRadius * 20) + mmRadius)
                                    };
                                });
                                break;
                        }


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
                        var poligons = voronoi.polygons(circles)
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
                            .attr("r", mmRadius)
                            .style("fill", function (d, i) {
                                return color(i);
                            });

                        circle.on("click", function (d) {
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

                    });
                }
            };
        }])

    .directive('barChart',
        function ($window, $timeout, d3Service) {
            return {
                restrict: 'EA',
                scope: {},

            };
        })

    // function () {
    //
    // var chart = d3.custom.barChart();
    // return {
    //     restrict: 'E',
    //     replace: true,
    //     template: '<div class="chart"></div>',
    //     scope: {
    //         height: '=height',
    //         data: '=data',
    //         hovered: '&hovered'
    //     },
    //     link: function (scope, element, attrs) {
    //         var chartEl = d3.select(element[0]);
    //
    //         chart.on('customHover', function (d, i) {
    //             scope.hovered({args: d});
    //         });
    //
    //         scope.$watch('data', function (newVal, oldVal) {
    //             chartEl.datum(newVal).call(chart);
    //         });
    //
    //         scope.$watch('height', function (d, i) {
    //             chartEl.call(chart.height(scope.height));
    //         })
    //     }
    // }
    // })
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