'use strict';


// ####################################### GLOBAL SCOPE #######################################


// Stores all task objects
let users = [];
let tasks = [];

setURL('http://gruppe-211.developerakademie.net/smallest_backend_ever');


// ####################################### MAIN FUNCTIONS #######################################


/**
 * Initialize needed functions
 */
async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    selectNavElement();
}


/**
 * Converts the global arrays into strings and saves them on the backend
 */
async function saveToBackend() {
    let usersAsJSON = JSON.stringify(users);
    let tasksAsJSON = JSON.stringify(tasks);
    await backend.setItem('users', usersAsJSON);
    await backend.setItem('tasks', tasksAsJSON);
}


/**
 * Loads the saved strings from the backend. The strings are converted again and assigned to the arrays
 */
async function loadFromBackend() {
    let usersAsJSON = await backend.getItem('users');
    let tasksAsJSON = await backend.getItem('tasks');
    users = JSON.parse(usersAsJSON) || [];
    tasks = JSON.parse(tasksAsJSON) || [];
}


/**
 * Open a Dialog-Window
 * @param {string} id - Passes the html id of the dialog window
 */
function openDialog(id) {
    document.getElementById(id).classList.remove('d-none');
}


/**
 * Close a Dialog-Window
 * @param {string} id - Passes the html id of the dialog window
 */
function closeDialog(id) {
    document.getElementById(id).classList.add('d-none');
}


/**
 * Sets a previously saved value of an option to selected
 * @param {string} id - Passes the html id of the used option
 * @param {*} variable - Passes the value which is saved as selected
 */
function selectSavedOption(id, variable) {
    Array.from(document.querySelector(`#${id}`).options).forEach(function(option_element) {
        if (option_element.value == variable) {
            option_element.selected = true;
        }
    });
}