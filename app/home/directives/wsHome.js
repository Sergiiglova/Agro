angular.module('wise.home').directive('wsHome', function() {
    return {
        restrict: 'AE',
        scope: {
            data: '=ngModel'
        },
        templateUrl: 'app/home/views/home.html',
        controller: 'HomeCtrl',

        link: function (scope) {
            scope.data = {};
            scope.data.plantCrop = 25.6

        }


    }


});