angular.module('manMaths')

.factory('Maths', function($resource, $filter) {
    var Maths = {
    	// Thanks https://stackoverflow.com/questions/2094967/excel-pmt-function-in-js
        PMT: function(rate_per_period, number_of_payments, present_value, future_value, type){
		    if(rate_per_period != 0.0){
		        // Interest rate exists
		        var q = Math.pow(1 + rate_per_period, number_of_payments);
		        return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

		    } else if(number_of_payments != 0.0){
		        // No interest rate, but number of payments exists
		        return -(future_value + present_value) / number_of_payments;
		    }

		    return 0;
		}
    }

    return Maths;
});