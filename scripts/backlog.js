'use strict';

// ####################################### GLOBAL SCOPE #######################################

// Stores all task objects
let tasks = [];
setURL('http://gruppe-211.developerakademie.net/smallest_backend_ever');


// ####################################### MAIN FUNCTIONS #######################################

async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
}

/**
 * Show all unallocated Objects from Server
 */
function showBacklog() {
    loadFromBackend();
    
}

/**
 * This function loads the saved strings from the backend. The strings are converted again and assigned to the arrays
 */
function loadFromBackend() {
    let tasksAsJSON = backend.getItem('tasks');
    tasks = JSON.parse(tasksAsJSON) || [];
}