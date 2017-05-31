'use strict';

// Declare app level module which depends on views, and components
angular.module('manMaths', [
  'ui.router',
  'ngResource'
]).
config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider.state({
    'name': 'splash',
    'url': '/',
    'templateUrl': 'partials/splash.html',
    'resolve': {
        'vehicles': function(Vehicle) {
        	return Vehicle.loadVehicles().$promise;
        }
    },
    'controller': function($scope, vehicles) {
    	$scope.vehicles = vehicles;

    	console.log(vehicles[0]);
    }
  }).state({
    'name': 'calculator',
    'url': '/:id/:spec',
    'templateUrl': 'partials/calculator.html',
    'resolve': {
    	'vehicles': function(Vehicle) {
        	return Vehicle.loadVehicles().$promise;
        },

        'vehicle': function($stateParams, vehicles) {
        	var vehicle = null;

        	for (var i = 0; i < vehicles.length; i++) {
        		if (vehicles[i].id === $stateParams.id) {
        			vehicle = vehicles[i];
        			break;
        		}
        	}

        	return vehicle;
        }
    },
    'controller': 'CalculatorController'
  });
}]);
