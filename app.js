// This is an IIFE that allows us to have data privacy because it
// creates a new scope that is not visible from the outside scope
// Our variable and function cannot be accessed from the outside

// BUDGET CONTROLLER MODULE
var budgetController = (function() {

    var x = 23;

    var add = function(a) {
        return x + a;
    }

    return {
        publicTest: function(b) {
            return add(b);
        }
    }

})();


// UI MODULE
var UIController = (function() {




})();


var controller = (function(budgetCtrl, UICtrl) {
    // pass other 2 modules as arguments to this one so we can connect them
    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: function() {
            console.log(z);
            // This is the only way we can access z from the outside
        }
    }

})(budgetController, UIController);