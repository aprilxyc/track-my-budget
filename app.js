// This is an IIFE that allows us to have data privacy because it
// creates a new scope that is not visible from the outside scope
// Our variable and function cannot be accessed from the outside

// BUDGET CONTROLLER MODULE
var budgetController = (function() {

    // Some code

})();


// UI MODULE
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'

    };


    // method to get input
    // needs to be used in other controller so will be public method
    return {
        getInput: function() {
            return { // return these 3 properties
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value

            }
           
        },

        getDOMstrings: function() { // exposing DOMStrings to public
            return DOMstrings;
        }



    };


})();


// GLOBAL APP CONTROLLER
// Controller is the place where we tell the other modules
// what to do
var controller = (function(budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMstrings(); // get the DOM strings from UI controller

    var ctrlAddItem = function() {

        // 1. Get the field input data
        var input = UICtrl.getInput(); // controller calls method then getInput method does something and returns 
        console.log(input);

        // 2. Add the item to te budget controller

        // 3. Add the item to te UI

        //4. Calculate the budget

        //5. Display the budget on the UI

    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        
        // whcih is for older browsers that don't have this keycode
        // property
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem(); // call the add item function
        }

    });
})(budgetController, UIController);