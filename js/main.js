'use strict';

// ####################################### GLOBAL SCOPE #######################################


// Stores all task objects
let users = [];
let tasks = [];

// ####################################### MAIN FUNCTIONS #######################################

setURL('https://scripts.lukas-volgger.dev/smallest_backend_ever');

/**
 * Initialize needed functions
 */
async function init() {
    await downloadFromServer();
    includeHTML();
    loadFromBackend();
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


/**
 * Decides which update function to run
 * @param {string} page - Passes the id of the page which is currently used
 */
async function update(page) {
    switch (page) {
        case 'backlog':
            await updateBacklog();
            break;
        case 'board':
            await updateBoard();
            break;
    }
}


/**
 * Moves a task to the board or back to the backlog
 * @param {number} i - Passes the index of the task to be changed
 * @param {string} page - Passes the id of the page which is currently used
 */
async function move(i, page) {
    switch (page) {
        case 'backlog':
            tasks[i].processing_state = 'todo';
            break;
        case 'board':
            tasks[i].processing_state = 'unallocated';
            break;
    }
    closeDialog(`dialog-bg-${page}`);
    await update(page);
}


/**
 * Shows all information of a task that is important for the user
 * @param {number} i - Passes the index of the task
 * @param {string} page - Passes the id of the page which is currently used
 */
function showTask(i, page) {
    openDialog(`dialog-bg-${page}`);
    document.getElementById(`dialog-content-${page}`).innerHTML = templateTask(i, page);
    document.getElementById(`move-to-${page}-icon`).classList.add('d-none');
}


/**
 * Allows changing an already existing task
 * @param {number} i - Passes the index of the task to be changed
 * @param {string} page - Passes the id of the page which is currently used
 */
function editTask(i, page) {
    document.getElementById(`dialog-content-${page}`).innerHTML = '';
    document.getElementById(`dialog-content-${page}`).innerHTML = templateEditTask(i, page);
    document.getElementById(`change-${page}-title`).value = tasks[i].title;
    document.getElementById(`change-${page}-date`).value = tasks[i].due_date;
    document.getElementById(`change-${page}-description`).value = tasks[i].description;
    selectSavedOption(`change-${page}-category`, tasks[i].category);
    selectSavedOption(`change-${page}-urgency`, tasks[i].urgency);
    selectSavedOption(`change-${page}-assigned-to`, tasks[i].assigned_to);
}


/**
 * Saves the changes made while editing
 * @param {number} i - Passes the index of the task to be changed
 * @param {string} page - Passes the id of the page which is currently used
 */
async function changeTask(i, page) {
    tasks[i].title = document.getElementById(`change-${page}-title`).value;
    tasks[i].category = document.getElementById(`change-${page}-category`).value;
    tasks[i].description = document.getElementById(`change-${page}-description`).value;
    tasks[i].due_date = document.getElementById(`change-${page}-date`).value;
    tasks[i].urgency = document.getElementById(`change-${page}-urgency`).value;
    tasks[i].assigned_to = document.getElementById(`change-${page}-assigned-to`).value;
    showTask(i, page);
    await update(page);
}


/**
 * Delete a Task
 * @param {number} i - Passes the index of the task to be changed
 * @param {string} page - Passes the id of the page which is currently used
 */
async function deleteTask(i, page) {
    tasks.splice(i, 1);
    closeDialog(`dialog-bg-${page}`);
    await update(page);
}


/**
 * Generate dynamic HTML-Code for a dialog window in which a task is displayed
 * @param {number} i - Passes the index of the task which should be displayed
 * @param {string} page - Passes the id of the page which is currently used
 * @returns {HTMLElement} Returns dynamic HTML-Code
 */
function templateTask(i, page) {
    return `
    <div class="dialog-task" id="${page}-item-${i}">
        <i class="fa-solid fa-xmark" aria-label="Close" onclick="closeDialog('dialog-bg-${page}')"></i>
        <div class"icon-menu">
            <i class="fa-solid fa-file-circle-plus" aria-label="Move to Board" title="Move to Board" id="move-to-board-icon" onclick="move(${i}, '${page}')"></i>
            <i class="fa-solid fa-file-circle-minus" aria-label="Remove from Board" title="Remove from Board" id="move-to-backlog-icon" onclick="move(${i}, '${page}')"></i>
            <i class="fa-solid fa-pen-to-square" aria-label="Edit Task" title="Edit Task" onclick="editTask(${i}, '${page}')"></i>
            <i class="fa-solid fa-trash-can" aria-label="Delete Task" title="Delete Task" onclick="deleteTask(${i}, '${page}')"></i>
        </div>
        <div class="task-header">
            <div>
                <span class="task-title form-label">TITLE</span>
                <p class="task-title">${tasks[i].title}</p>
            </div>
            <div>
                <span class="form-label">ASSIGNED TO</span>
                <div class="assigned-to">
                    <img class="rounded-circle profile-picture" src="../assets/img/pp_${tasks[i].assigned_to}.png" alt="">
                    <div class="person-name">
                        <span>${tasks[i].assigned_to}</span>
                        <span style="color: #6f8bf3f7">${tasks[i].assigned_to}@join.com</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="task-settings">
            <div>
                <span class="form-label">CATEGORY</span>
                <p>${tasks[i].category}</p>
            </div>
            <div>
                <span class="form-label">URGENCY</span>
                <p>${tasks[i].urgency}</p>
            </div>
            <div>
                <span class="form-label">DUE DATE</span>
                <p class="task-date">${tasks[i].due_date}</ü>
            </div>
        </div>
        <div class="task-description">
            <span class="form-label">DESCRIPTION</span>
            <p class="description">${tasks[i].description}</p>
        </div>
    </div>
    `;
}


/**
 * Generate dynamic HTML-Code for a dialog window in which a task can be changed
 * @param {number} i - Passes the index of the task which should be displayed
 * @param {string} page - Passes the id of the page which is currently used
 * @returns {HTMLElement} Returns dynamic HTML-Code
 */
function templateEditTask(i, page) {
    return `
    <div class="edit-dialog">
        <i class="fa-solid fa-xmark" onclick="closeDialog('dialog-bg-${page}')" title="Close"></i>
        <form action="" onsubmit="changeTask(${i}, '${page}'); return false;" class="add-task-form">
        <div class="add-task-form--left">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">TITLE</label>
                <input type="text" class="form-control input-field" id="change-${page}-title" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">CATEGORY</label>
                <select class="form-select input-field" id="change-${page}-category" aria-label="CATEGORY" required>
                    <option id="category-option-1" value="category_1">Category 1</option>
                    <option id="category-option-2" value="category_2">Category 2</option>
                    <option id="category-option-3" value="category_3">Category 3</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">DESCRIPTION</label>
                <textarea class="form-control textarea-input" id="change-${page}-description" rows="3" required></textarea>
            </div>
        </div>
        <div class="add-task-form--right">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">DUE DATE</label>
                <input type="date" class="form-control input-field" id="change-${page}-date" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">URGENCY</label>
                <select class="form-select input-field" id="change-${page}-urgency" aria-label="URGENCY" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">ASSIGNED TO</label>
                <select class="form-select input-field" id="change-${page}-assigned-to" aria-label="ASSIGNED TO" required>
                    <option value="samir_barbat">Samir BARBAT</option>
                    <option value="samuel_bergen">Samuel Bergen</option>
                    <option value="lukas_volgger">Lukas VOLGGER</option>
                </select>
            </div>
            <div class="mb-3 form-controls">
                <button type="reset" class="btn btn-light cancel-btn" onclick="showTask(${i}, '${page}')">CANCEL</button>
                <button type="submit" class="btn btn-primary submit-btn">SAVE CHANGES</button>
            </div>
        </div>
        </form>
    </div>
    `;
}