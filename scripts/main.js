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
function saveToBackend() {
    let usersAsJSON = JSON.stringify(users);
    let tasksAsJSON = JSON.stringify(tasks);
    backend.setItem('users', usersAsJSON);
    backend.setItem('tasks', tasksAsJSON);
}


/**
 * Loads the saved strings from the backend. The strings are converted again and assigned to the arrays
 */
function loadFromBackend() {
    let usersAsJSON = backend.getItem('users');
    let tasksAsJSON = backend.getItem('tasks');
    users = JSON.parse(usersAsJSON) || [];
    tasks = JSON.parse(tasksAsJSON) || [];
}