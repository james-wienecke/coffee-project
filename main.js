"use strict"

// it returns html code that displays ONE coffee's info in a div, name in <h4> and roast in <p>
// this function is run by renderCoffees
function renderCoffee(coffee) {
    // each list in the list of of coffees we will display is simply going to be sent back as
    // <div class="coffee"><h4>*COFFEE NAME*</h4> <p>*COFFEE ROAST*</p></div>
    let html = '<div class="coffee">';
    html += '<h4 class="coffee-name">' + coffee.name + '</h4> ';
    html += '<p class="coffee-roast">' + coffee.roast + '</p>';
    html += '</div>'

    return html;
}

// this function puts together all the new html code for displaying a table in the web page
function renderCoffees(coffees) {
    var html = '';
    for (var i = 0; i < coffees.length; i++) {
        html += renderCoffee(coffees[i]);
    }
    return html;
}

function updateCoffees(e) {
    // e calls back to the event manager and is connected form submission
    e.preventDefault(); // don't submit the form, we just want to update the data
    // roastSelection is given values to present the user in the html page and this data is then
    // sent into the javascript application by this variable assignment.
    var selectedRoast = roastSelection.value;
    // this string contains the coffee name we wish to match with
    let selectedName = nameSearch.value;
    // filteredCoffees is created here empty and will be filled with coffees with data matching
    var filteredCoffees = [];
    //                          coffee here is just a selector for each element inside coffeeS which is defined below
    coffees.forEach(function (coffee) {
        if (matchRoast(coffee, selectedRoast) && matchName(coffee, selectedName)) {
            filteredCoffees.push(coffee);
        }
    });
    // this sets the coffee display div to display the coffees currently matching the criteria (all at first)
    coffeeDiv.innerHTML = renderCoffees(filteredCoffees);
}

/** new functions go under here
 */

/** The matchRoast function takes a coffee object and a roast string and compares them, returning a
 * boolean value corresponding to the two parameter's matching. Additionally, it exits early if the value
 * selected by the user is 'all roasts' so as to enable the other search criteria to match in isolation.
 *
 * @param coffee            object, contains an id number, a name string, and a roast string
 * @param roast             string, can be either any of the coffee roast values or 'all roasts'
 * @returns {boolean}
 */
function matchRoast(coffee, roast) {
    if (roast === 'all roasts') return true;
    if (coffee.roast === roast) {
        return true;
    } else {
        return false;
    }
}

/** The matchName function takes a coffee object and a roast string and compares them, returning a
 * boolean value corresponding to the two parameter's matching. If the indexOf() method returns, -1,
 * the search criteria the user specified does not match the coffee object currently being evaluated.
 * Any result larger than -1 is considered a partial match, and the function returns true. Additionally,
 * this function exits early if the search string is empty, to allow for pure roast filtering.
 *
 * @param coffee            object, contains an id number, a name string, and a roast string
 * @param search            string, can be either any of the coffee roast values or 'all roasts'
 * @returns {boolean}
 */
function matchName(coffee, search) {
    if (search === '') return true;
    if (coffee.name.toLowerCase().indexOf(search) >= 0) {
        return true;
    } else {
        return false;
    }
}

/** things that are run when page first loads go under here
 */

// this is the list of coffees and their data
// it is an array of objects which have this structure:
// id:       <number>
// name:     <string>
// roast:    <string>
// from http://www.ncausa.org/About-Coffee/Coffee-Roasts-Guide
var coffees = [
    {id: 1, name: 'Light City', roast: 'light'},
    {id: 2, name: 'Half City', roast: 'light'},
    {id: 3, name: 'Cinnamon', roast: 'light'},
    {id: 4, name: 'City', roast: 'medium'},
    {id: 5, name: 'American', roast: 'medium'},
    {id: 6, name: 'Breakfast', roast: 'medium'},
    {id: 7, name: 'High', roast: 'dark'},
    {id: 8, name: 'Continental', roast: 'dark'},
    {id: 9, name: 'New Orleans', roast: 'dark'},
    {id: 10, name: 'European', roast: 'dark'},
    {id: 11, name: 'Espresso', roast: 'dark'},
    {id: 12, name: 'Viennese', roast: 'dark'},
    {id: 13, name: 'Italian', roast: 'dark'},
    {id: 14, name: 'French', roast: 'dark'},
];

// this contains the html element we are going to display the "list" of coffees with
const coffeeDiv = document.querySelector('#coffee-display-container');
// this is the button with the event listener which calls the updateCoffees function
const submitButton = document.querySelector('#submit');
// this is the roast options dropdown element
const roastSelection = document.querySelector('#roast-selection');

// this is the text field for searching by name
const nameSearch = document.querySelector('#name-search');


// this line initially fills the table with ALL coffees
coffeeDiv.innerHTML = renderCoffees(coffees);


//when submitButton is clicked, updateCoffees runs
submitButton.addEventListener('click', updateCoffees);

roastSelection.addEventListener('input', updateCoffees);
nameSearch.addEventListener('input', updateCoffees);