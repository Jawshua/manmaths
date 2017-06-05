angular.module('manMaths')

.factory('Vehicle', function($resource, $filter, Maths) {
    var Vehicle = $resource('data/vehicles.json', {}, {
        loadVehicles: {method:'GET', isArray: true}
    });

    function calculateMonthly(amortize, gfv, term, apr) {
        var termPayment = Maths.PMT((apr / 12) / 100, term - 1, amortize, 0, 0) * -1;
        var balloonInterest = (gfv * apr) / 100 * (term / 12) / term;

        return (termPayment + balloonInterest).toFixed(2);
    }

    Vehicle.prototype.selectedExtras = function() {
        return $filter('filter')(this.options, {selected: true});
    };

    Vehicle.prototype.sumExtras = function(field) {
        var value = 0;
        var selected = this.selectedExtras();

        angular.forEach(selected, function(option) {
            value += option[field];
        });

        return value;
    };

    Vehicle.prototype.calculateExtraMonthlies = function() {
        var interest = (this.apr / 12) / 100;
        var apr = this.apr;
        var term = this.term;
        var useDiscount = this.usePercentage;
        var discount = this.discountPercentage;

        angular.forEach(this.options, function(option) {
            var price = option.price;

            if (useDiscount) {
                price = (price / 100) * (100 - discount);
            }

            var finance = price + option.otr - option.gfv;

            option.monthly = calculateMonthly(finance, option.gfv, term, apr);


        });
    }

    Vehicle.prototype.calculateDiscountFromPercentage = function() {
        this.dealerDiscount = Number((this.totalPrice() * (this.discountPercentage / 100)).toFixed(2));
    }

    Vehicle.prototype.calculatePercentageFromDiscount = function() {
        this.discountPercentage = Number(((this.dealerDiscount / this.totalPrice()) * 100).toFixed(5));
    }


    Vehicle.prototype.totalGfv = function() {
        return this.gfv + this.sumExtras('gfv');
    };

    Vehicle.prototype.totalExtras = function() {
        return this.sumExtras('price');
    }

    Vehicle.prototype.totalOTR = function () {
        return this.otr + this.sumExtras('otr');
    }

    Vehicle.prototype.totalPrice = function() {
        return this.price + this.totalExtras();
    };

    Vehicle.prototype.totalPriceOTR = function () {
        return this.totalOTR() + this.totalPrice();
    }

    Vehicle.prototype.totalPriceOTR = function () {
        return this.totalOTR() + this.totalPrice();
    }

    Vehicle.prototype.totalPriceOTRDiscounted = function () {
        return this.totalPriceOTR() - this.dealerDiscount - this.financeContribution;
    }

    Vehicle.prototype.totalDiscountPercentage = function () {

        return (100 - (this.totalPriceOTRDiscounted() / this.totalPriceOTR() * 100)).toFixed(2);
    }

    Vehicle.prototype.amountToFinance = function() {
        return this.totalPriceOTRDiscounted() - this.deposit - this.totalGfv();
    };

    Vehicle.prototype.calculateMonthlyRate = function() {
        return calculateMonthly(this.amountToFinance(), this.totalGfv(), this.term, this.apr);
    };

    Vehicle.prototype.serialize = function() {
        var extras = this.selectedExtras();

        var ids = [];
        angular.forEach(extras, function(extra) {
            ids.push(extra.id);
        });

        var data = this.deposit + ';' + this.financeContribution + ';' + this.discountPercentage + ';' + (this.usePercentage ? '1' : '0') + ';' + ids.join(',');

        return btoa(data).replace(/=+/,'');
    }

    Vehicle.prototype.deserialize = function(str) {
        var data = atob(str).split(';');

        if (data.length != 5) {
            return;
        }

        this.deposit = Number(data[0]);
        this.financeContribution = Number(data[1]);
        this.discountPercentage = Number(data[2]);
        this.usePercentage = (data[3] === '1')

        var ids = data[4].split(',');
        angular.forEach(this.options, function(option) {
            angular.forEach(ids, function(id) {
                if (option.id == id) {
                    option.selected = true;
                }
            })
        })
    }

    return Vehicle;
});