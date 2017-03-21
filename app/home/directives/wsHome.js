angular.module('wise.home').directive('wsHome', function () {
    return {
        restrict: 'AE',
        scope: {
            data: '=ngModel'
        },
        templateUrl: 'app/home/views/home.html',
        controller: 'HomeCtrl',

        // TODO - recalculate plant
        link: function (scope) {
            scope.data = {};
            scope.data.plantCrop = 25.6
            scope.data.plantRadius = 12.45;
            scope.data.radiusDividingCount = 10;
            scope.data.dividingList = [];

            scope.recalc = function () {
                console.log("recalculated");
                data = scope.data;


                var rStep = data.plantRadius / data.radiusDividingCount;
                data.quarterPlantCrop = data.plantCrop / 4;


                for (var i = 0; i < data.radiusDividingCount; i++) {
                    data.dividingList.push({
                        value: data.quarterPlantCrop / data.radiusDividingCount,
                        rStep: rStep,

                        index: i,
                        title: "до " + Math.round(rStep * (i + 1),1) + " см."
                    });

                }

            };
            scope.$watch('data.plantCrop', scope.recalc);

            scope.$watch('data.radiusDividingCount', scope.recalc);

            scope.getDividingSum = function () {
                var data = scope.data;
                var sum = 0;
                for (var i = 0; i < data.radiusDividingCount; i++) {
                    sum += data.dividingList[i].value;
                }
                return sum;
            }
        }


    }


});