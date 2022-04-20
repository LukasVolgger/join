'use strict';

// ####################################### GLOBAL SCOPE #########################################

let boardTasks = [];

// ####################################### MAIN FUNCTIONS #######################################


async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    selectNavElement();
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
 * Create a Backlog-item
 */
function createBacklogItem() {
    let content = document.getElementById('backlog-content');
    for (let i = 0; i < tasks.length; i++) {
        content.innerHTML += templateBacklogItem(i, tasks[i]);
    }
}


/**
 * Shows selection dialog for choosing different tasks
 */
function openSelectionDialog(i) {
    document.getElementById('dialog-bg').classList.remove('d-none');
    let content = document.getElementById('dialog-content');
    content.innerHTML = templateSelectionDialog(i);
}


/**
 * This function allows you to edit a backlog-item after create
 */
function moveToBoard(i, task) {
    boardTasks.push(task);
    tasks.splice(i, 1);
    saveToBackend();
    closeDialog();
    showBacklog();
}


/**
 * This function allows you to edit a backlog-item after create
 */
function editTask(i, task) {
    let content = document.getElementById('dialog-content');
    content.innerHTML = templateEditTask(i, tasks[i]);
    document.getElementById('change-task-title').value = task.title;
    // not completely
}


/**
 * This function allows you to edit a backlog-item after create
 */
 function deleteTask(i) {
    tasks.splice(i, 1);
    saveToBackend();
    closeDialog();
    showBacklog();
}


/**
 * This function close a Dialog-Window with display: none
 */
function closeDialog() {
    document.getElementById('dialog-bg').classList.add('d-none');
}


/**
 * This function generate HTML-Code for one Backlog-Item
 */
function templateBacklogItem(i, task) {
    return `
        <div class="backlog-item ${task.category}" id="backlog-item-${i}" onclick="openSelectionDialog(${i})">
            <div class="person">
                <img class="rounded-circle profile-picture" src="../imgs/pp_${task.assigned_to}.jfif" alt="">
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
 * This function generate dynamic HTML-Code for the selection dialog
 */
function templateSelectionDialog(i) {
    return `
        <div class="selection-dialog">
            <i class="fa-solid fa-xmark" onclick="closeDialog()"></i>
            <button class="selection-dialog-btn btn btn-primary" onclick="moveToBoard(${i}, tasks[${i}])">Move to Board</button>
            <button class="selection-dialog-btn btn btn-primary" onclick="editTask(${i}, tasks[${i}])">Edit Task</button>
            <button class="selection-dialog-btn btn btn-primary" onclick="deleteTask(${i})">Delete Task</button>
        </div>
    `;
}


/**
 * This function generate dynamic HTML-Code for the edit dialog
 */
function templateEditTask(i, task) {
    return `
    <div class="edit-dialog">
        <i class="fa-solid fa-xmark" onclick="closeDialog()"></i>
        <form action="" onsubmit="changeTask(); return false;" class="add-task-form">
        <div class="add-task-form--left">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">TITLE</label>
                <input type="text" class="form-control input-field" id="change-task-title" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">CATEGORY</label>
                <select class="form-select input-field" id="change-task-category" aria-label="CATEGORY" required>
                    <option id="category-option-1" value="category_1">Category 1</option>
                    <option id="category-option-2" value="category_2">Category 2</option>
                    <option id="category-option-3" value="category_3">Category 3</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">DESCRIPTION</label>
                <textarea class="form-control textarea-input" id="task-description" rows="3" required></textarea>
            </div>
        </div>
        <div class="add-task-form--right">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">DUE DATE</label>
                <input type="date" class="form-control input-field" id="task-due-date" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">URGENCY</label>
                <select class="form-select input-field" id="task-urgency" aria-label="URGENCY" required>
                    <option selected value="">...</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">ASSIGNED TO</label>
                <select class="form-select input-field" id="task-assigned-to" aria-label="ASSIGNED TO" required>
                    <option selected value="">...</option>
                    <option value="samir_barbat">Samir BARBAT</option>
                    <option value="samuel_bergen">Samuel Bergen</option>
                    <option value="lukas_volgger">Lukas VOLGGER</option>
                </select>
            </div>
            <div class="mb-3 form-controls">
                <button type="reset" class="btn btn-light cancel-btn">CANCEL</button>
                <button type="submit" class="btn btn-primary submit-btn">SAVE CHANGES</button>
            </div>
        </div>
        </form>
    </div>
    `;
}