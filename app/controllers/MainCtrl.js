app.controller('mainCtrl', ['$scope', '$timeout', '$mdSidenav', '$mdDialog', '$location',
    function ($scope, $timeout, $mdSidenav, $mdDialog, $location) {

        $scope.pages = {first: true, second: true,third:true};
        $scope.goto = function (divName) {
            if (divName == "1") {
                $scope.pages.first = true;
                $scope.pages.second = false;
                $scope.pages.third = false;
            } else {
                $scope.pages.first = false;
                $scope.pages.second = true;
                $scope.pages.third = false;
            }
        }
    }]);

