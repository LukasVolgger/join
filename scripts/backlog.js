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


function showTask(i) {
    openDialog();
    document.getElementById('dialog-content').innerHTML = templateTask(i);
}


/**
 * This function allows you to edit a backlog-item after create
 */
function moveToBoard(i) {
    boardTasks.push(tasks[i]);
    tasks.splice(i, 1);
    updateBacklog();
}


/**
 * This function allows you to edit a backlog-item after create
 */
function editTask(i) {
    document.getElementById('dialog-content').innerHTML = '';
    document.getElementById('dialog-content').innerHTML = templateEditTask(i);
    document.getElementById('change-task-title').value = tasks[i].title;
    document.getElementById('change-date').value = tasks[i].due_date;
    document.getElementById('change-task-description').value = tasks[i].description;
    selectSavedOption('#change-task-category', tasks[i].category);
    selectSavedOption('#change-task-urgency', tasks[i].urgency);
    selectSavedOption('#change-assigned-to', tasks[i].assigned_to);
}


/**
 * 
 */
function selectSavedOption(id, variable) {
    Array.from(document.querySelector(id).options).forEach(function (option_element) {
        if (option_element.value == variable) {
            option_element.selected = true;
        }
    });
}


/**
 * 
 */
function changeTask(i) {
    tasks[i].title = document.getElementById('change-task-title').value;
    tasks[i].category = document.getElementById('change-task-category').value;
    tasks[i].description = document.getElementById('change-task-description').value;
    tasks[i].due_date = document.getElementById('change-date').value;
    tasks[i].urgency = document.getElementById('change-task-urgency').value;
    tasks[i].assigned_to = document.getElementById('change-assigned-to').value;
    updateBacklog();
    showTask(i);
}


/**
 * This function allows you to edit a backlog-item after create
 */
function deleteTask(i) {
    tasks.splice(i, 1);
    updateBacklog();
}


function openDialog() {
    document.getElementById('dialog-bg').classList.remove('d-none');
}


/**
 * This function close a Dialog-Window with display: none
 */
function closeDialog() {
    document.getElementById('dialog-bg').classList.add('d-none');
}


/**
 * 
 */
function updateBacklog() {
    saveToBackend();
    closeDialog();
    showBacklog();
}


/**
 * This function generate HTML-Code for one Backlog-Item
 */
function templateBacklogItem(i) {
    return `
        <div class="backlog-item ${tasks[i].category}" id="backlog-item-${i}" onclick="showTask(${i})">
            <div class="person">
                <img class="rounded-circle profile-picture" src="../imgs/pp_${tasks[i].assigned_to}.jfif" alt="">
                <div class="person-name">
                    <span>${tasks[i].assigned_to}</span>
                    <span style="color: #6f8bf3f7">${tasks[i].assigned_to}@join.com</span>
                </div>
            </div>
            <div> ${tasks[i].category} </div>
            <div class="backlog-item-description">${tasks[i].description}</div>
        </div>
    `;
}


function templateTask(i) {
    return `
        <div class="dialog-task ${tasks[i].category}" id="backlog-item-${i}">
        <i class="fa-solid fa-xmark" aria-label="Close" onclick="closeDialog()"></i>
        <div class"icon-menu">
        <i class="fa-solid fa-file-circle-plus" aria-label="Move to Board" onclick="moveToBoard(${i})"></i>
        <i class="fa-solid fa-pen-to-square" aria-label="Edit Task" onclick="editTask(${i})"></i>
        <i class="fa-solid fa-trash-can" aria-label="Delete Task" onclick="deleteTask(${i})"></i>
        </div>
            <div class="task-header">
                <div class="task-title-container">
                    <div class="task-title"><b>Title</b></div>
                    <div class="task-title"> ${tasks[i].title} </div>
                </div>
                <div>
                    <div><b>Assigned to</b></div>
                    <div class="person">
                        <img class="rounded-circle profile-picture" src="../imgs/pp_${tasks[i].assigned_to}.jfif" alt="">
                        <div class="person-name">
                            <span>${tasks[i].assigned_to}</span>
                            <span style="color: #6f8bf3f7">${tasks[i].assigned_to}@join.com</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-settings">
                <div>
                    <div><b>Category</b></div>
                    <div>${tasks[i].category}</div>
                </div>
                <div>
                    <div><b>Urgency</b></div>
                    <div> ${tasks[i].urgency} </div>
                </div>
                <div>
                    <div><b>Due Date</b></div>
                    <div class="task-date">${tasks[i].due_date}</div>
                </div>
            </div>
                <div class="task-description">
                    <div><b>Description:</b></div>
                    <div class="description">${tasks[i].description}</div>
                </div>
            </div>
        `;
}


/**
 * This function generate dynamic HTML-Code for the edit dialog
 */
function templateEditTask(i) {
    return `
    <div class="edit-dialog">
        <i class="fa-solid fa-xmark" onclick="closeDialog()"></i>
        <form action="" onsubmit="changeTask(${i}); return false;" class="add-task-form">
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
                <textarea class="form-control textarea-input" id="change-task-description" rows="3" required></textarea>
            </div>
        </div>
        <div class="add-task-form--right">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">DUE DATE</label>
                <input type="date" class="form-control input-field" id="change-date" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">URGENCY</label>
                <select class="form-select input-field" id="change-task-urgency" aria-label="URGENCY" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">ASSIGNED TO</label>
                <select class="form-select input-field" id="change-assigned-to" aria-label="ASSIGNED TO" required>
                    <option value="samir_barbat">Samir BARBAT</option>
                    <option value="samuel_bergen">Samuel Bergen</option>
                    <option value="lukas_volgger">Lukas VOLGGER</option>
                </select>
            </div>
            <div class="mb-3 form-controls">
                <button type="reset" class="btn btn-light cancel-btn" onclick="showTask(${i})">CANCEL</button>
                <button type="submit" class="btn btn-primary submit-btn">SAVE CHANGES</button>
            </div>
        </div>
        </form>
    </div>
    `;
}