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

    // calculate total expenses or total incomes
    var calculateTotal = function(type) {
        var sum = 0; // initial sum

        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        data.totals[type] = sum; // put it into the data
    }

    var data = { // This is private in our module
        allItems: { // expenses and incomes object
            exp: [],
            inc: []
    },

    totals: { // total expenses and total incomes object
        exp: 0,
        inc: 0
    },
    budget: 0,
    percentage: -1 // set to -1 to show that it is non-existent
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

    deleteItem: function(type, id) {
        var ids, index;

        // create array with all the id numbers we have
        // loop over elements of the array

        // map RETURNS A BRAND NEW ARRAY (different to foreach)
        ids = data.allItems[type].map(function(current) {
            return current.id;
        });

        index = ids.indexOf(id); // get the id

        if (index !== -1) { // if index is not -1 then we want to delete it
            // splice is used to delete element
            data.allItems[type].splice(index, 1);
            // removes elements at the number INDEX
        }

    },

    calculateBudget: function() {

        // Calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        // Calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        // Calculate the percentage of income that we spent
        if (data.totals.inc > 0 ) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1; // no percentage to calculate
        }
    
    },

    getBudget: function() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }
    },

    // console.logs data structure since it is private
    // PUBLIC METHOD TO EXPOSE INTERNAL DATA
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };


    // method to get input
    // needs to be used in other controller so will be public method
    return {
        getInput: function() {
            return { // return these 3 properties
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            }
           
        },

        addListItem: function(obj, type) { // type is income or expense
            var html, newHtml, element;
            // create html string witj placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

        // need a class name or id from html to manipulate this!
        deleteListItem: function(selectorID) {

            var myElement;

            myElement = document.getElementById(selectorID);
            // in javascript, we can delete a child by moving up first, then going back to the child
            // get parent node from element then remove the chidl, which is this element
            myElement.parentNode.removeChild(myElement);

        },

        // clear fields fater entering it
        clearFields: function() {
            var fields, fieldsArr;
            
            // This returns a list
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields); // trick slice method into thinking we gave it an array

            fieldsArr.forEach(function(current, index, array) {
                // clear the fields
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        // displays budget onto the UI
        displayBudget: function(obj) {
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function() {

        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };


    // functino called when someone hits enter key
    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput(); // controller calls method then getInput method does something and returns 

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to te budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

        }

    };

    var ctrlDeleteItem = function(event) { // event there to know what target element is
        var itemID, splitID, type, ID;


        // parent Node gets the unique ID at the very top
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // get parent node of DOM
        // make things happen ONLY if item id is defined
        if (itemID) {
            
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0]; //first element is the type 
            ID = parseInt(splitID[1]);

            // 1. Delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget(); // function that updates budget
        }


    };

    return { // event listeners only going to be set up as soon as we call the init function
        init: function() {
            // Starts the program
            console.log('Application has started');
            UICtrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                }
            );
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init(); // starts the event l;isteners