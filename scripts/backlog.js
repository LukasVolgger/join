'use strict';

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
        if (tasks[i].processing_state == 'unallocated') {
            content.innerHTML += templateBacklogItem(i);
        }
    }
}


function showBacklogTask(i) {
    openDialog('dialog-bg-backlog');
    document.getElementById('dialog-content-backlog').innerHTML = templateBacklogTask(i);
}


/**
 * This function allows you to move an item to the board
 */
async function moveToBoard(i) {
    tasks[i].processing_state = 'todo';
    await updateBacklog();
}


/**
 * This function allows you to edit a task after create
 */
 function editBacklogTask(i) {
    document.getElementById('dialog-content-backlog').innerHTML = '';
    document.getElementById('dialog-content-backlog').innerHTML = templateEditBacklogTask(i);
    document.getElementById('change-backlog-title').value = tasks[i].title;
    document.getElementById('change-backlog-date').value = tasks[i].due_date;
    document.getElementById('change-backlog-description').value = tasks[i].description;
    selectSavedOption('#change-backlog-category', tasks[i].category);
    selectSavedOption('#change-backlog-urgency', tasks[i].urgency);
    selectSavedOption('#change-backlog-assigned-to', tasks[i].assigned_to);
}


/**
 * This function saves the changes made while editing
 */
async function changeBacklogTask(i) {
    tasks[i].title = document.getElementById('change-backlog-title').value;
    tasks[i].category = document.getElementById('change-backlog-category').value;
    tasks[i].description = document.getElementById('change-backlog-description').value;
    tasks[i].due_date = document.getElementById('change-backlog-date').value;
    tasks[i].urgency = document.getElementById('change-backlog-urgency').value;
    tasks[i].assigned_to = document.getElementById('change-backlog-assigned-to').value;
    showBacklog();
    showBacklogTask(i);
    await saveToBackend();
}


/**
 * This function allows you to edit a backlog-item after create
 */
 async function deleteBacklogTask(i) {
    tasks.splice(i, 1);
    await updateBacklog();
}


/**
 * 
 */
 async function updateBacklog() {
    closeDialog('dialog-bg-backlog');
    showBacklog();
    await saveToBackend();
}


/**
 * This function generate HTML-Code for one Backlog-Item
 */
 function templateBacklogItem(i) {
    return `
        <div class="backlog-item ${tasks[i].category}" id="backlog-item-${i}" onclick="showBacklogTask(${i})">
            <div class="backlog-item-assigned">
                <span class="mobile-only-backlog">ASSIGNED TO:</span>
                <div class="person">
                    <img class="rounded-circle profile-picture" src="../imgs/pp_${tasks[i].assigned_to}.jfif" alt="">
                    <div class="person-name">
                        <span>${tasks[i].assigned_to}</span>
                        <span style="color: #6f8bf3f7">${tasks[i].assigned_to}@join.com</span>
                    </div>
                </div>
            </div>
            <div class="backlog-item-category">
            <span class="mobile-only-backlog">CATEGORY:</span>
                <span>${tasks[i].category}</span>
            </div>
            <div class="backlog-item-description">
            <span class="mobile-only-backlog">DESCRIPTION:</span>
                <span>${tasks[i].description}</span>
            </div>
        </div>
    `;
}


function templateBacklogTask(i) {
    return `
    <div class="dialog-task" id="backlog-item-${i}">
        <i class="fa-solid fa-xmark" aria-label="Close" onclick="closeDialog('dialog-bg-backlog')"></i>
        <div class"icon-menu">
            <i class="fa-solid fa-file-circle-plus" aria-label="Move to Board" title="Move to Board" onclick="moveToBoard(${i})"></i>
            <i class="fa-solid fa-pen-to-square" aria-label="Edit Task" title="Edit Task" onclick="editBacklogTask(${i})"></i>
            <i class="fa-solid fa-trash-can" aria-label="Delete Task" title="Delete Task" onclick="deleteBacklogTask(${i})"></i>
        </div>
        <div class="task-header">
            <div>
                <span class="task-title form-label">TITLE</span>
                <p class="task-title">${tasks[i].title}</p>
            </div>
            <div>
                <span class="form-label">ASSIGNED TO</span>
                <div class="assigned-to">
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
 * This function generate dynamic HTML-Code for the edit dialog
 */
function templateEditBacklogTask(i) {
    return `
    <div class="edit-dialog">
        <i class="fa-solid fa-xmark" onclick="closeDialog('dialog-bg-backlog')" title="Close"></i>
        <form action="" onsubmit="changeBacklogTask(${i}); return false;" class="add-task-form">
        <div class="add-task-form--left">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">TITLE</label>
                <input type="text" class="form-control input-field" id="change-backlog-title" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">CATEGORY</label>
                <select class="form-select input-field" id="change-backlog-category" aria-label="CATEGORY" required>
                    <option id="category-option-1" value="category_1">Category 1</option>
                    <option id="category-option-2" value="category_2">Category 2</option>
                    <option id="category-option-3" value="category_3">Category 3</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">DESCRIPTION</label>
                <textarea class="form-control textarea-input" id="change-backlog-description" rows="3" required></textarea>
            </div>
        </div>
        <div class="add-task-form--right">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">DUE DATE</label>
                <input type="date" class="form-control input-field" id="change-backlog-date" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">URGENCY</label>
                <select class="form-select input-field" id="change-backlog-urgency" aria-label="URGENCY" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">ASSIGNED TO</label>
                <select class="form-select input-field" id="change-backlog-assigned-to" aria-label="ASSIGNED TO" required>
                    <option value="samir_barbat">Samir BARBAT</option>
                    <option value="samuel_bergen">Samuel Bergen</option>
                    <option value="lukas_volgger">Lukas VOLGGER</option>
                </select>
            </div>
            <div class="mb-3 form-controls">
                <button type="reset" class="btn btn-light cancel-btn" onclick="showBacklogTask(${i})">CANCEL</button>
                <button type="submit" class="btn btn-primary submit-btn">SAVE CHANGES</button>
            </div>
        </div>
        </form>
    </div>
    `;
}