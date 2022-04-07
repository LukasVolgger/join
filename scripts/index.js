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
 * Gets the user input and creates an object 
 */
function addTask() {
    let title = document.getElementById('task-title');
    let category = document.getElementById('task-category');
    let description = document.getElementById('task-description');
    let dueDate = document.getElementById('task-due-date');
    let urgency = document.getElementById('task-urgency');
    let assignedTo = document.getElementById('task-assigned-to');

    let task = {
        'title': `${title.value}`,
        'category': `${category.value}`,
        'description': `${description.value}`,
        'due_date': `${dueDate.value}`,
        'urgency': `${urgency.value}`,
        'assigned_to': `${assignedTo.value}`,
        'creation_date': new Date().getTime()
    };

    console.log(task);
    tasks.push(task);

    saveToBackend();

    // Reset input fields
    title.value = '';
    category.value = '';
    description.value = '';
    dueDate.value = '';
    urgency.value = '';
    assignedTo.value = '';
}

/**
 * This function converts the global arrays into strings and saves them on the backend
 */
function saveToBackend() {
    let tasksAsJSON = JSON.stringify(tasks);
    backend.setItem('tasks', tasksAsJSON);
}


/**
 * This function loads the saved strings from the backend. The strings are converted again and assigned to the arrays
 */
function loadFromBackend() {
    let tasksAsJSON = backend.getItem('tasks');
    tasks = JSON.parse(tasksAsJSON) || [];
}