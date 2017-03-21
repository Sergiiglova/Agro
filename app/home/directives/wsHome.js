angular.module('wise.home').directive('wsHome', function () {
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
            scope.data = {};
            data= scope.data;
            data.plantCrop = 25.6
            data.plantRadius = 12.45;
            data.radiusDividingCount = 10;
            data.dividingList=[];
            var rStep = data.plantRadius / data.radiusDividingCount;
            data.quarterPlantCrop = data.plantCrop / 4;

            for (var i = 0; i < data.radiusDividingCount; i++) {
                data.dividingList.push({
                    value: data.quarterPlantCrop / data.radiusDividingCount,
                    rStep: rStep,

                    index: i,
                    title: "до " + Math.round(rStep * (i + 1), 1) + " см."
                });

            }


            scope.recalc = function () {
                console.log("recalculated");
                data = scope.data;

                var rStep = data.plantRadius / data.radiusDividingCount;
                data.quarterPlantCrop = data.plantCrop / 4;

                if (data.radiusDividingCount!=data.dividingList.length ) {
                    for (var i = 0; i < data.radiusDividingCount; i++) {
                        data.dividingList.push({
                            value: data.quarterPlantCrop / data.radiusDividingCount,
                            rStep: rStep,

                            index: i,
                            title: "до " + Math.round(rStep * (i + 1), 1) + " см."
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
                var sum = 0;
                if (data.radiusDividingCount > 0) {
                    for (var i = 0; i < data.radiusDividingCount; i++) {
                        sum += data.dividingList[i].value;
                    }
                }
            };

            scope.needAlign = function () {
                if (scope.data) {
                    return Math.abs(scope.getDividingSum() - scope.data.quarterPlantCrop) < 0.01;
                }
                return false;
            }

        }


    }


});