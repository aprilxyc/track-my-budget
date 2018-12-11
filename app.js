// This is an IIFE that allows us to have data privacy because it
// creates a new scope that is not visible from the outside scope
// Our variable and function cannot be accessed from the outside

// BUDGET CONTROLLER MODULE
var budgetController = (function() {

    // Some code

})();


// UI MODULE
var UIController = (function() {

    // Some code


})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {


    var ctrlAddItem = function() {

              // 1. Get the field input data

        // 2. Add the item to te budget controller

        // 3. Add the item to te UI

        //4. Calculate the budget

        //5. Display the budget on the UI

        console.log('It works');
    }


    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        
        // whcih is for older browsers that don't have this keycode
        // property
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem(); // call the add item function
        }

    });
})(budgetController, UIController);