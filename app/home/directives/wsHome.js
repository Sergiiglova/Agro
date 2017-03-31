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
                    // TODO - new
                    console.log("sow");

                };

                scope.test = function () {
                    data.k = 2.30628;
                    data.precision = 20;
                    var dx = dy = (data.plantRadius / data.precision);

                    data.oppression = [[]];
                    var j = 0;
                    for (var i = 0; i < data.precision; i++) {
                        var x = dx * (i + 1);
                        var value1 = 6.14321 - data.k * Math.log(x - dx);
                        var value2 = 6.14321 - data.k * Math.log(x + dx);
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
                    cropData.rowSpace = 30;
                    cropData.columnSpace = 4.7;
                    cropData.plantData = scope.data;


                    cropData.width = 1000;
                    cropData.height = 1000;
                    cropData.mmInPixel = 1;
                    cropData.mmFieldWidth = cropData.width * cropData.mmInPixel;
                    cropData.mmFieldHeight = cropData.height * cropData.mmInPixel;
                    cropData.smToMM = 10;
                    cropData.mmRadius = cropData.plantData.plantRadius * cropData.smToMM;

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
                    scope.sow = function (d3) {
                        var circles = [];
                        var cropData = scope.cropData;
                        switch (cropData.cropType) {
                            case "rows":
                                var y = 0.5 * cropData.rowSpace * cropData.smToMM; // отступ от краев
                                while (y < cropData.mmFieldHeight) {
                                    var x = 0.5 * cropData.columnSpace + cropData.smToMM;
                                    while (x < cropData.mmFieldWidth) {
                                        circles.push({x: x, y: y})
                                        x += cropData.columnSpace * cropData.smToMM;
                                    }
                                    y += cropData.rowSpace * cropData.smToMM;
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
                                        x: Math.round(Math.random() * (cropData.mmFieldWidth - cropData.mmRadius * 20) + cropData.mmRadius),
                                        y: Math.round(Math.random() * (cropData.mmFieldHeight - cropData.mmRadius * 20) + cropData.mmRadius)
                                    };
                                });
                                break;
                        }
                        return circles;
                    };

                    scope.updatePlantsCrop = function (circles, poligons) {
                        var cropData = scope.cropData;
                        for (var k = 0; k < circles.length; k++) {
                            var plant = circles[k];
                            var poligon = poligons[k];
                            var step = 1;

                            var minX = plant.x - cropData.mmRadius;
                            var maxX = plant.x + cropData.mmRadius;
                            var ugnetenie = 0;
                            var x = minX;

                            while (x <= maxX) {

                                var dY = Math.sqrt(cropData.mmRadius * cropData.mmRadius - Math.pow((plant.x - x), 2));
                                var minY = plant.y - dY;
                                var maxY = plant.y + dY;
                                var y = minY;
                                while (y <= maxY) {
                                    // that is inCircle points(x,y coordinates) for integral
                                    var vs = poligon;
                                    var inside = false;
                                    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                                        xi = vs[i][0],
                                            yi = vs[i][1],
                                            xj = vs[j][0],
                                            yj = vs[j][1],
                                            intersect = ((yi > y) != (yj > y))
                                                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                                        if (intersect) inside = !inside;
                                    }
                                    if (!inside) {
                                        var r = Math.sqrt(Math.pow(x - plant.x, 2) + Math.pow(y - plant.y, 2));
                                        var ro = cropData.plantData.k / ((r / cropData.smToMM) * 2 * Math.PI);
                                        ugnetenie += step * step * ro / (cropData.smToMM * cropData.smToMM);
                                    }
                                    y += step;
                                }
                                x += step;
                            }
                            plant.ugnetenie = ugnetenie;
                            plant.urogainost = cropData.plantData.plantCrop - plant.ugnetenie;
                        }
                    };

                    scope.fullRefresh = function (d3, circles, polygons) {
                        var cropData = scope.cropData;

                        var svg = d3.select("#chart")
                            .append('svg')
                            .attr("width", cropData.width)
                            .attr("height", cropData.height)
                            .style('width', '100%');

                        var color = d3.scaleOrdinal()
                            .range(d3.schemeCategory20);

                        var circle = scope.circle = svg.selectAll("g")
                            .data(circles)
                            .enter().append("g")
                            .call(d3.drag()
                                .on("start", dragstarted)
                                .on("drag", scope.dragged)
                                .on("end", dragended));

                        var cell = scope.cell = circle.append("path")
                            .data(polygons)
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
                            .attr("r", cropData.mmRadius)
                            .style("fill", function (d, i) {
                                return color(i);
                            });

                        circle.append("circle")
                            .data(circles)
                            .attr("cx", function (d) {
                                return d.x;
                            })
                            .attr("cy", function (d) {
                                return d.y;
                            })
                            .attr("r", 2)
                            .style("fill", function (d, i) {
                                return "black";
                            });

                        circle.append("text")
                            .data(circles)
                            .attr("x", function (d) {
                                return d.x - 10;
                            })
                            .attr("y", function (d) {
                                return d.y - 10;
                            })
                            .attr("dy", ".35em")
                            .text(function (d) {
                                return Math.round(d.urogainost * 100) / 100;
                            });

                        circle.on("click", function (d) {
                            testClick(d);
                        });

                    };

                    d3Service.d3().then(function (d3) {
                        scope.d3 = d3;
                        var cropData = scope.cropData;

                        var circles = scope.circles = scope.sow(d3);

                        scope.voronoi = d3.voronoi()
                            .x(function (d) {
                                return d.x;
                            })
                            .y(function (d) {
                                return d.y;
                            })
                            .extent([[-1, -1], [cropData.width + 1, cropData.height + 1]]);

                        var polygons = scope.voronoi.polygons(circles);

                        scope.updatePlantsCrop(circles, polygons);

                        scope.fullRefresh(d3, circles, polygons);

                    });

                    function testClick(d) {
                        console.log("testClick");
                    }

                    function dragstarted(d) {
                        d3.select(this).raise().classed("active", true);
                    }

                    scope.dragged = function(d) {
                        d3 = scope.d3;
                        var c = d3.select(this);

                        c.selectAll("circle")
                            .attr("cx", d.x = d3.event.x)
                            .attr("cy", d.y = d3.event.y);

                        c.select("text")
                            .attr("x", d.x = d3.event.x - 10)
                            .attr("y", d.y = d3.event.y - 10);


                        scope.polygons = scope.voronoi.polygons(scope.circles);


                        cell = scope.cell
                            .data(scope.polygons)
                            .attr("d", renderCell);
                    };

                    function dragended(d, i) {
                        d3.select(this).classed("active", false);
                        // TODO - recalc
                        // TODO - redrow


                    }

                    function renderCell(d) {
                        return d == null ? null : "M" + d.join("L") + "Z";
                    }

                }
            }
        }]
    )

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