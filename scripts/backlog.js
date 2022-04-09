'use strict';

// ####################################### GLOBAL SCOPE #######################################

// Stores all task objects
let tasks = [];
setURL('http://gruppe-211.developerakademie.net/smallest_backend_ever');

let task = [{
    'assigned_to': "samuel_bergen",
    'category': "category_2",
    'creation_date': 1649493181425,
    'description': "User-Login erstellen mit Nutzername und Passwort\nUser anlegen",
    'due_date': "2022-04-11",
    'title': "User-Login machen",
    'urgency': "high"
}];


// ####################################### MAIN FUNCTIONS #######################################

async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    showBacklog();
}

/**
 * Show all unallocated Objects from Server
 */
function showBacklog() {
    let content = document.getElementById('backlog-content');
    content.innerHTML = '';
    createBacklogItem();
}

/**
 * This function loads the saved strings from the backend. The strings are converted again and assigned to the arrays
 */
function loadFromBackend() {
    let tasksAsJSON = backend.getItem('tasks');
    tasks = JSON.parse(tasksAsJSON) || [];
}


/**
 * Create a Backlog-item
 */
function createBacklogItem() {
    let content = document.getElementById('backlog-content');
    for (let i = 0; i < tasks.length; i++) {
        content.innerHTML += templateBacklogItem(i, tasks[i]);
    }
}


/**
 * This function allows you to edit a backlog-item after create
 */
function editTask(i) {

}

/**
 * This function generate HTML-Code for one Backlog-Item
 */
function templateBacklogItem(i, task) {
    return `
        <div class="backlog-item ${task.category}" id="backlog-item-${i}" onclick="editTask(${i})">
            <div class="person">
                <img class="rounded-circle profile-picture" src="imgs/pp_${task.assigned_to}.jfif" alt="">
                <div class="person-name">
                    <span>${task.assigned_to}</span>
                    <a href="mailto:${task.assigned_to}@join.com">${task.assigned_to}@join.com</a>
                </div>
            </div>
            <div> ${task.category} </div>
            <div>${task.description}</div>
        </div>
    `;
}

/**
 * This function generate dynamic HTML-Code for the edit-Dialog
 */
function templateEditTask(i, task) {
    return `
    
    `;
}