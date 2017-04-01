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

                    cropData.smToMM = 10;
                    cropData.mmRadius = cropData.plantData.plantRadius * cropData.smToMM;
                    cropData.width = 2 * cropData.mmRadius * 5;
                    cropData.height = 2 * cropData.mmRadius * 8;

                    cropData.mmInPixel = 1;
                    cropData.mmFieldWidth = cropData.width * cropData.mmInPixel;
                    cropData.mmFieldHeight = cropData.height * cropData.mmInPixel;
                    cropData.productivity = 0;

                    // new
                    cropData.seedingRate = 0;
                    cropData.productivitySquare = 0;
                    cropData.productivity = 0;
                    cropData.totalProductivity = 0;
                    cropData.plantCount = 0;
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
                };
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

                    scope.calculateProductivity = function () {
                        // TODO - make productiviti rectangle as list of the points
                        // TODO - in rectange - function  - when in rectangle - add to sum when plan productiviti calculated
                        // TODO - several rectangles for every cropType


                    };

                    scope.sow = function (d3) {
                        var circles = [];
                        var cropData = scope.cropData;
                        var n = 0;
                        var m = 0;

                        switch (cropData.cropType) {
                            case "rows":
                                var startY = cropData.mmRadius;
                                var startX = cropData.mmRadius;
                                var dy = cropData.rowSpace * cropData.smToMM;
                                var dx = cropData.columnSpace * cropData.smToMM;

                                var y = startY;
                                //+ * cropData.rowSpace * cropData.smToMM; // отступ от краев
                                //var n = (cropData.mmFieldHeight - 4 * cropData.mmRadius) / dy;
                                //var m = (cropData.mmFieldWidth - 4 * cropData.mmRadius) / dx;
                                while (y < cropData.mmFieldHeight - 2 * cropData.mmRadius) {

                                    var x = startX;
                                    //0.5 *cropData.columnSpace + cropData.smToMM;
                                    while (x < cropData.mmFieldWidth - 2 * cropData.mmRadius) {
                                        circles.push({x: x, y: y});
                                        x += dx;
                                        m++;
                                    }
                                    y += dy;
                                    n++;
                                }
                                m = Math.round(m / n) - 2;
                                var x1 = startX + 0.5 * dx;
                                var y1 = startY + 0.5 * dy;
                                var x2 = x1 + m * dx;
                                var y2 = y1 + (n - 2) * dy;
                                scope.productivityRectangle = [
                                    {x: x1, y: y1},
                                    {x: x1, y: y2},
                                    {x: x2, y: y2},
                                    {x: x2, y: y1}];
                                scope.productivityRectangle1 = [
                                    [x1, y1],
                                    [x1, y2],
                                    [x2, y2],
                                    [x2, y1]
                                ];

                                cropData.productivitySquare = (m * dx) * ((n - 2) * dy) / (100 * 100 * 100);
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

                    scope.needRecalc = function (plant) {
                        var x = scope.oldXY.x;
                        var y = scope.oldXY.y;
                        var r1 = Math.sqrt(Math.pow(x - plant.x, 2) + Math.pow(y - plant.y, 2));

                        var x = scope.newXY.x;
                        var y = scope.newXY.y;
                        var r2 = Math.sqrt(Math.pow(x - plant.x, 2) + Math.pow(y - plant.y, 2));
                        return (2 * scope.cropData.mmRadius > r1) || (2 * scope.cropData.mmRadius > r2);
                    };

                    scope.updatePlantsCrop = function (circles, poligons, wihtCheck) {
                        var cropData = scope.cropData;

                        for (var k = 0; k < circles.length; k++) {

                            var plant = circles[k];
                            if (!wihtCheck || (scope.needRecalc(plant))) {
                                var poligon = poligons[k];
                                var step = 0.75;

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
                                        var inside = scope.inPolygon(x, y, poligon);
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
                                if (scope.inPolygon(plant.x, plant.y, scope.productivityRectangle1)) {
                                    cropData.productivity += plant.urogainost;
                                }
                            }
                        }
                    };

                    scope.inPolygon = function (x, y, vs) {
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
                        return inside;
                    };

                    scope.getSvg = function () {
                        if (scope.svg) {
                            return scope.svg;
                        } else {
                            return scope.svg = d3.select("#chart")
                                .append('svg')
                                .attr("width", scope.cropData.width)
                                .attr("height", scope.cropData.height)
                                .style('width', '100%');
                        }
                    };
                    scope.fullRefresh = function (d3, circles, polygons) {
                        var cropData = scope.cropData;

                        var svg = scope.getSvg();


                        var color = d3.scaleOrdinal()
                            .range(d3.schemeCategory20);

                        var circle = scope.circle = svg.selectAll("g")
                            .data(circles)
                            .enter().append("g")
                            .call(d3.drag()
                                .on("start", scope.dragstarted)
                                .on("drag", scope.dragged)
                                .on("end", scope.dragended));

                        var rectW = scope.productivityRectangle[2].x - scope.productivityRectangle[0].x
                        var rectH = scope.productivityRectangle[2].y - scope.productivityRectangle[0].y

                        //var rectangle = circle.append("rect")
                        //    .attr("x", scope.productivityRectangle[0].x)
                        //    .attr("y", scope.productivityRectangle[0].y)
                        //    .attr("width", rectW)
                        //    .attr("height", rectH)
                        //    .attr("fill", "transparent")
                        //    .attr("stroke", "black")
                        //    .attr("stroke-width", "3");


                        var cell = scope.cell = circle.append("path")
                            .data(polygons)
                            .attr("d", renderCell)
                            .attr("id", function (d, i) {
                                return "cell-" + i;
                            })
                            //.attr("stroke","black")
                            .attr("stroke-width", "3");

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

                        scope.updatePlantsCrop(circles, polygons, false);

                        scope.fullRefresh(d3, circles, polygons);

                    });

                    function testClick(d) {
                        console.log("testClick");
                    }

                    scope.dragstarted = function (d) {
                        d3.select(this).raise().classed("active", true);
                        scope.oldXY = {x: d.x, y: d.y}
                    };

                    scope.dragged = function (d) {
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

                    scope.dragended = function (d, i) {
                        // TODO - recalculation only some polygons
                        scope.oldXY;
                        scope.newXY = {x: d.x, y: d.y};

                        scope.updatePlantsCrop(scope.circles, scope.polygons, true);

                        scope.circle.select("text")
                            .data(scope.circles)
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

                        d3.select(this).classed("active", false);
                    };


                    function renderCell1(d) {
                        return d == null ? null : "M" + d.join("L") + "Z";
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