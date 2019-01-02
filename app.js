// This is an IIFE that allows us to have data privacy because it
// creates a new scope that is not visible from the outside scope
// Our variable and function cannot be accessed from the outside

// BUDGET CONTROLLER MODULE
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = { // This is private in our module
        allItems: { // expenses and incomes object
            exp: [],
            inc: []
    },

    totals: { // total expenses and total incomes object
        exp: 0,
        inc: 0
    }
};

return { // public method that can be accessed by other modules
    // type refers to whether it is income or expense
    addItem: function(type, des, val) {
        var newItem, ID;


        // Create new ID then create new item based on 'inc' or 'exp' type
       if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // unique number that we want to assign to each new item
       } else {
           ID = 0;
       }
       
        // That we put either in expense or income arrays for the allItems
        // How can we specify the ID for each new item?
        // ID = last ID + 1
        if (type === 'exp') {
            newItem = new Expense(ID, des, val);
        } else if (type === 'inc') {
            newItem = new Income(ID, des, val);
        }

        // Push it into our data structure
        data.allItems[type].push(newItem); // add to data structure
        // Return the new element
        return newItem;
    },

    // console.logs data structure since it is private
    testing: function() {
        console.log(data);
    }
}

})();

// UI MODULE
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
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

        addListItem: function(obj, type) { // type is income or expense
            var html, newHtml, element;
            // create html string witj placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            // hthml has their own methods just like arrays
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
    

            // Insert the HTML into the DOM
            // insert adjacent html element
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings(); // get the DOM strings from UI controller

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            
            // whcih is for older browsers that don't have this keycode
            // property
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem(); // call the add item function
            }
    
        });

    };


    // functino called when someone hits enter key
    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput(); // controller calls method then getInput method does something and returns 

        // 2. Add the item to te budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        //4. Calculate the budget

        //5. Display the budget on the UI

    };

    return { // event listeners only going to be set up as soon as we call the init function
        init: function() {
            // Starts the program
            console.log('Application has started')
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init(); // starts the event l;isteners