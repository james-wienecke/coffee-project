"use strict"

// the little fadein animations can be bypassed by setting this to false
let pref_enableAnimation = true;    // deliberately scoped here to allow user access

$(document).ready(function () {
    /** things that are run when page first loads go under here
     */

    // this is the list of coffees and their data
    // it is an array of objects which have this structure:
    // id:       <number>
    // name:     <string>
    // roast:    <string>
    // from http://www.ncausa.org/About-Coffee/Coffee-Roasts-Guide
    const coffees = [
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
    const $coffeeDiv = $('#coffee-display-container');
    // this is the roast options dropdown element
    const $roastSelection = $('#roast-selection');

    // this is the text field for searching by name
    const $nameSearch = $('#name-search');

    // check window.localStorage for coffees to load
    getLocalCoffeeData();

    // this line initially fills the table with ALL coffees
    nodeBuildCoffeeList(coffees);

    // filter updates automatically and redraws coffee list when any input method changes
    $roastSelection.on('change', function () {
            updateCoffees();
    });
    $nameSearch.on('input', function () {
            updateCoffees();
    });

    // 'add a coffee' form DOM linkups below here
    const roastAdd = document.querySelector('#roast-add');
    const nameAdd = document.querySelector('#name-add');
    const newCoffeeSubmit = document.querySelector('#submit-add');

    // this runs the 'add a coffee' routine
    newCoffeeSubmit.addEventListener('click', addCoffee);

/** updateCoffees is the main way our coffee list gets updated to filter for user input. It's setup to only take
 *  events from 'input' eventListeners, when it will save the contents of both primary inputs to corresponding
 *  variables. It then creates a bucket array that will be used to store matches from the main coffees array so
 *  that these whitelisted coffee objects can be sent to our render pipeline and get those matches out for users.
 */
function updateCoffees() {
    // roastSelection is given values to present the user in the html page and this data is then
    // sent into the javascript application by this variable assignment.
    const selectedRoast = $('#roast-selection option:selected').text();
    // this string contains the coffee name we wish to match with
    const selectedName = $nameSearch.val();
    // filteredCoffees is created here empty and will be filled with coffees with data matching
    let filteredCoffees = [];

    for (const coffee of coffees) {
        if (matchRoast(coffee, selectedRoast) && matchName(coffee, selectedName)) {
            filteredCoffees.push(coffee);
        }
    }
    // we need to build up a new node tree for the document so that our chosen coffee objects will be displayed
    nodeBuildCoffeeList(filteredCoffees);
}

/** new functions go under here **/

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
    return (coffee.roast === roast);
}

/** The matchName function takes a coffee object and a roast string and compares them, returning a
 * boolean value corresponding to the two parameter's matching. If the indexOf() method returns, -1,
 * the search criteria the user specified does not match the coffee object currently being evaluated.
 * Any result larger than -1 is considered a partial match, and the function returns true. Additionally,
 * this function exits early if the search string is empty, to allow for pure filtering by roast.
 *
 * @param coffee            object, contains an id number, a name string, and a roast string
 * @param search            string, can be either any of the coffee roast values or 'all roasts'
 * @returns {boolean}
 */
function matchName(coffee, search) {
    if (search === '') return true;
    return (coffee.name.toLowerCase().indexOf(search) >= 0);
}

/** The addCoffee function should only be run as an event fired from a button's click event. The e parameter is
 * used to prevent a full default form submission. This function constructs a new coffee object from user's input
 * and adds it to the existing coffee array with an appropriate ID. Next it refreshes the coffee display and
 * clears all inputs to both forms.
 *
 * @param e
 */
function addCoffee(e) {
    e.preventDefault(); // DON'T submit form
    const newCoffee = {
        id: coffees.length + 1,
        name: nameAdd.value,
        roast: roastAdd.value
    };
    addCoffeeToStorage(newCoffee.id, newCoffee.name, newCoffee.roast);
    coffees.push(newCoffee);
    document.querySelector('#add-form').reset();
    document.querySelector('#search-form').reset();
    nodeBuildCoffeeList(coffees);
}

/** The addCoffeeToStorage function saves the user's new coffee to be loaded after their session ends.
 * Our approach is to destructure the coffee object and assign its data to three individual pieces of data.
 * By using string template literals, we can dynamically alter the key name for each new coffee object
 * The format for naming the keys is: *id*_id, *id*_name, *id*_roast. For example, the coffee with id 16
 * would have its localStorage keys look like this: 16_id, 16_name, 16_roast.
 *
 * @param id
 * @param name
 * @param roast
 */
function addCoffeeToStorage(id, name, roast) {
    // localStorage only allows strings to be given to it, so in order to prevent key collisions
    // and retain meaningful key names, we are using string template literals. They require a backtick (`)
    // instead of quotes or double-quotes ('/") and we can dynamically change their content with ${<var>}
    localStorage.setItem(`${id}_id`, id);
    localStorage.setItem(`${id}_name`, name);
    localStorage.setItem(`${id}_roast`, roast);
}

/** The getLocalCoffeeData retrieves the coffee data saved to localStorage. It restructures a coffee object
 * from localStorage, essentially doing addCoffeeToStorage in reverse. Once a coffee object is built, it
 * pushes the object into the main coffees array
 */
function getLocalCoffeeData() {
    // if the localStorage does not have exactly 3 key:value pairs, we won't add the coffee from storage
    if(localStorage.length % 3 === 0) {
        // the idLookup variable is going to help us rebuild the key names to access the coffee data in localStorage
        let idLookup = coffees.length + 1;
        // we load saved coffee in batches of 3 key:value pairs
        for(let i = 0; i < (localStorage.length / 3); i++) {
            let loadCoffee = {
                id: parseFloat(localStorage.getItem(`${idLookup}_id`)),
                name: localStorage.getItem(`${idLookup}_name`),
                roast: localStorage.getItem(`${idLookup}_roast`)
            };
            idLookup++; // we need to increment our id lookup to access the next coffee's data
            coffees.push(loadCoffee); // get that coffee in there!
        }
    } else {
        console.log("Malformed data in localStorage:", localStorage);
    }
    // very unnecessary but just makes double extra sure our coffee array is always sorted in ascending order
    coffees.sort((x, y) => (x.id > y.id) ? 1 : -1);
}

/** nodeBuildCoffeeItem is essentially equivalent to "renderCoffee" in the original project, but has been tweaked
 * to allow a new node-based approach. This process is much more granular and allows fine control of the list
 * population (ie. does not require the entire element to be built at once).
 *
 * @param coffee            a single coffee object
 * @returns newDiv          a document node
 */
function nodeBuildCoffeeItem(coffee) {
    const newH4 = $(document.createElement("h4"))
        .addClass("coffee-name mb-0")
        .text(coffee.name);

    const newP = $(document.createElement("P"))
        .addClass(`coffee-roast my-auto ${coffee.roast}-roast`)
        .text(coffee.roast);

    // the coffee's data will be placed inside this container so that it can be displayed inline via flex
    // we use this second div layer to allow a fade-in effect that changes display but we also want flex display
    const newCont = $(document.createElement('div'))
        .addClass("justify-content-between d-flex")
        // add h4 and p to this container
        .append(newH4)
        .append(newP);

    // return a final wrapper div
    return $(document.createElement('div'))
        // add that class for major styling selection and fade-in animation
        .addClass("coffee border")
        // append all of the previously created elements
        .append(newCont);
}

/** nodeBuildCoffeeList is the equivalent of the renderCoffees function in the original project. Thanks to
 * using a node-based system, this function can achieve cool things (such as adding a small delay before
 * each coffee is put into the list).
 *
 * @param coffees           an array of coffee objects
 */
function nodeBuildCoffeeList(coffees) {
    $coffeeDiv.empty();
    // new jQuery implementation of list building!
    // here we create an array to be filled with jquery objects of coffee elements whose properties match the filter
    let newCoffees = [];
    for (const coffee of coffees) {
        newCoffees.push(nodeBuildCoffeeItem(coffee));
    }
    // here we append the new list of elements to the page's coffeeDiv element
    newCoffees.forEach(function (elem) {
        // by using elem.hide() we initially hide the new elements to allow for them to be faded in after
        // skip the hiding when animation is disabled
        (pref_enableAnimation) ? $coffeeDiv.append(elem.hide()) : $coffeeDiv.append(elem);
    });

    if (pref_enableAnimation) {
        // here we go through each of coffeeDiv children and fade them in according to a delayed index process
        $coffeeDiv.children().each(function (index) {
            $(this).delay(150*index).fadeIn(200);
        });
    }
}
});