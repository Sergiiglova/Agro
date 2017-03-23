angular.module('wise.home').controller('HomeCtrl', ['$scope', '$filter',
  'ngDialog', '$mdSidenav', '$timeout',
    function ($scope,  $filter,  ngDialog, $mdSidenav, $timeout) {
        $scope.options = {width: 500, height: 300, 'bar': 'aaa'};
        $scope.hovered = function(d){
            $scope.barValue = d;
            $scope.$apply();
        };
        $scope.barValue = 'None';
}]);