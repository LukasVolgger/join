'use strict';

// ####################################### GLOBAL SCOPE #######################################

// Stores all task objects
let tasks = [];

setURL('http://gruppe-211.developerakademie.net/smallest_backend_ever');

// ####################################### MAIN FUNCTIONS #######################################

function init() {
    includeHTML();
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

    // Reset input fields
    title.value = '';
    category.value = '';
    description.value = '';
    dueDate.value = '';
    urgency.value = '';
    assignedTo.value = '';
}