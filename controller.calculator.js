angular.module('manMaths')

.controller('CalculatorController', ['$stateParams', '$state', '$scope', 'vehicle', function($stateParams, $state, $scope, vehicle) {
    $scope.vehicle = angular.copy(vehicle);

    if ($stateParams.spec) {
    	$scope.vehicle.deserialize($stateParams.spec);
    }

    $scope.reset = function() {
    	$scope.vehicle = angular.copy(vehicle);
    };
}]);