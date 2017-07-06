angular.module('manMaths')

.controller('CalculatorController', ['$stateParams', '$state', '$scope', 'vehicle', function($stateParams, $state, $scope, vehicle) {
    $scope.vehicle = angular.copy(vehicle);
    $scope.vehicle.calculateExtraMonthlies();

    if ($stateParams.spec) {
        $scope.vehicle.deserialize($stateParams.spec);
        $scope.vehicle.calculateDiscountFromPercentage();
    }

    $scope.reset = function() {
        $scope.vehicle = angular.copy(vehicle);
        $scope.vehicle.calculateExtraMonthlies();
    };

    // Calculate discount amount based on percentage
    $scope.$watch('vehicle', function(now, old) {
        if ($scope.vehicle.usePercentage) {
            $scope.vehicle.calculateDiscountFromPercentage();
        } else {
            $scope.vehicle.calculatePercentageFromDiscount();
        }

        // Recalculate option estimates when percentages change
        if (now.usePercentage != old.usePercentage) {
            $scope.vehicle.calculateExtraMonthlies();
        } else if (now.usePercentage && old.discountPercentage != now.discountPercentage) {
            $scope.vehicle.calculateExtraMonthlies();
        }

        if (now.mileage != old.mileage) {
            console.log('haaay');
            $scope.vehicle.updateMileages();
        }
    }, true);
}]);