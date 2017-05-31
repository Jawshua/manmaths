angular.module('manMaths')

.factory('Vehicle', function($resource, $filter, Maths) {
    var Vehicle = $resource('data/vehicles.json', {}, {
        loadVehicles: {method:'GET', isArray: true}
    });

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

    Vehicle.prototype.amountToFinance = function() {
        return this.totalPriceOTR() - this.dealerDeposit - this.deposit - this.totalGfv();
    };

    Vehicle.prototype.calculateMonthlyRate = function() {
        var finance = this.amountToFinance();
        var balloon = this.totalGfv();


        var termPayment = Maths.PMT((this.apr / 12) / 100, this.term - 1, finance, 0, 0) * -1;
        var balloonInterest = (balloon * this.apr) / 100 * (this.term / 12) / this.term;

        return (termPayment + balloonInterest).toFixed(2);
    };

    Vehicle.prototype.serialize = function() {
        var extras = this.selectedExtras();

        var ids = [];
        angular.forEach(extras, function(extra) {
            ids.push(extra.id);
        });

        var data = this.deposit + ';' + this.dealerDeposit + ';' + ids.join(',');

        return btoa(data).replace(/=+/,'');
    }

    Vehicle.prototype.deserialize = function(str) {
        var data = atob(str).split(';');

        if (data.length != 3) {
            return;
        }

        this.deposit = Number(data[0]);
        this.dealerDeposit = Number(data[1]);

        var ids = data[2].split(',');
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