app.controller('mainCtrl', ['$scope', '$timeout', '$mdSidenav', '$mdDialog', '$location',
    function ($scope, $timeout, $mdSidenav, $mdDialog, $location) {

        $scope.pages = {experimentModel: true, plantModel: true, cropModel: true};
        $scope.goto = function (divName) {
            $scope.pages.experimentModel = false;
            $scope.pages.plantModel = false;
            $scope.pages.cropModel = false;
            switch (divName) {
                case "experimentModel":
                    $scope.pages.experimentModel = true;
                    break;
                case "plantModel":
                    $scope.pages.plantModel = true;
                    break;
                case "cropModel":
                    $scope.pages.cropModel = true;
                    break;
                default:
                    $scope.pages.experimentModel = true;
                    $scope.pages.plantModel = true;
                    $scope.pages.cropModel = true;
            }
        }
    }]);

