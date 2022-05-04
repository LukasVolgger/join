'use strict';


async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    selectNavElement();
    showBoard();
}


let currentDraggedElement;


function showBoard() {
    showColumn('todo');
    showColumn('inProgress');
    showColumn('testing');
    showColumn('done');
}


function showColumn(id) {
    let category = tasks.filter(t => t.processing_state == id);
    document.getElementById(id).innerHTML = '';
    for (let i = 0; i < category.length; i++) {
        let task = category[i];
        document.getElementById(id).innerHTML += templateBoardItem(task);
    }
}


function startDragging(creation_date) {
    currentDraggedElement = creation_date;
}


function allowDrop(ev) {
    ev.preventDefault();
}


async function moveTo(processingState) {
    tasks.find(t => t.creation_date === currentDraggedElement).processing_state = processingState;
    updateBoard();
    await saveToBackend();
}


function hightlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}


function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


function showBoardTask(creationDate) {
    openDialog('dialog-bg-board');
    let i = tasks.findIndex(t => t.creation_date == creationDate);
    document.getElementById('dialog-content-board').innerHTML = templateBoardTask(i);
}


async function removeFromBoard(i) {
    tasks[i].processing_state = 'unallocated';
    await updateBoard();
}


/**
 * This function allows you to edit a task after create
 */
function editBoardTask(i) {
    document.getElementById('dialog-content-board').innerHTML = '';
    document.getElementById('dialog-content-board').innerHTML = templateEditBoardTask(i);
    document.getElementById('change-board-title').value = tasks[i].title;
    document.getElementById('change-board-date').value = tasks[i].due_date;
    document.getElementById('change-board-description').value = tasks[i].description;
    selectSavedOption('#change-board-category', tasks[i].category);
    selectSavedOption('#change-board-urgency', tasks[i].urgency);
    selectSavedOption('#change-board-assigned-to', tasks[i].assigned_to);
}


/**
 * This function saves the changes made while editing
 */
async function changeBoardTask(i) {
    tasks[i].title = document.getElementById('change-board-title').value;
    tasks[i].category = document.getElementById('change-board-category').value;
    tasks[i].description = document.getElementById('change-board-description').value;
    tasks[i].due_date = document.getElementById('change-board-date').value;
    tasks[i].urgency = document.getElementById('change-board-urgency').value;
    tasks[i].assigned_to = document.getElementById('change-board-assigned-to').value;
    showBoard();
    showBoardTask(tasks[i].creation_date);
    await saveToBackend();
}

/**
 * This function allows you to edit a backlog-item after create
 */
async function deleteBoardTask(i) {
    tasks.splice(i, 1);
    await updateBoard();
}

async function updateBoard() {
    closeDialog('dialog-bg-board');
    showBoard();
    await saveToBackend();
}

function templateBoardItem(task) {
    return `
        <div draggable="true" ondragstart="startDragging(${task.creation_date})" class="board-item" onclick="showBoardTask(${task.creation_date})">
            <div class="board-item-section">
                <span class="board-item-header">TITLE:</span>
                <span class="board-item-title">${task.title}</span>
            </div>
            <div class="board-item-section">
                <span class="board-item-header">DUE DATE:</span> 
                <span>${task.due_date}</span>
            </div>
        </div>
    `;
}


function templateBoardTask(i) {
    return `
    <div class="dialog-task" id="board-item-${i}">
        <i class="fa-solid fa-xmark" aria-label="Close" onclick="closeDialog('dialog-bg-board')"></i>
        <div class"icon-menu">
            <i class="fa-solid fa-file-circle-minus" aria-label="Remove from Board" title="Remove from Board" onclick="removeFromBoard(${i})"></i>
            <i class="fa-solid fa-pen-to-square" aria-label="Edit Task" title="Edit Task" onclick="editBoardTask(${i})"></i>
            <i class="fa-solid fa-trash-can" aria-label="Delete Task" title="Delete Task" onclick="deleteBoardTask(${i})"></i>
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
function templateEditBoardTask(i) {
    return `
    <div class="edit-dialog">
        <i class="fa-solid fa-xmark" onclick="closeDialog('dialog-bg-board')" title="Close"></i>
        <form action="" onsubmit="changeBoardTask(${i}); return false;" class="add-task-form">
        <div class="add-task-form--left">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">TITLE</label>
                <input type="text" class="form-control input-field" id="change-board-title" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">CATEGORY</label>
                <select class="form-select input-field" id="change-board-category" aria-label="CATEGORY" required>
                    <option id="category-option-1" value="category_1">Category 1</option>
                    <option id="category-option-2" value="category_2">Category 2</option>
                    <option id="category-option-3" value="category_3">Category 3</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">DESCRIPTION</label>
                <textarea class="form-control textarea-input" id="change-board-description" rows="3" required></textarea>
            </div>
        </div>
        <div class="add-task-form--right">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">DUE DATE</label>
                <input type="date" class="form-control input-field" id="change-board-date" required>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">URGENCY</label>
                <select class="form-select input-field" id="change-board-urgency" aria-label="URGENCY" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">ASSIGNED TO</label>
                <select class="form-select input-field" id="change-board-assigned-to" aria-label="ASSIGNED TO" required>
                    <option value="samir_barbat">Samir BARBAT</option>
                    <option value="samuel_bergen">Samuel Bergen</option>
                    <option value="lukas_volgger">Lukas VOLGGER</option>
                </select>
            </div>
            <div class="mb-3 form-controls">
                <button type="reset" class="btn btn-light cancel-btn" onclick="showBoardTask(${tasks[i].creation_date})">CANCEL</button>
                <button type="submit" class="btn btn-primary submit-btn">SAVE CHANGES</button>
            </div>
        </div>
        </form>
    </div>
    `;
}