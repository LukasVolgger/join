'use strict';

//currently not working

async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    selectNavElement();
    updateHTML();
}

let currentDraggedElement;

function updateHTML() {

    // To Do
    let todo = tasks.filter(t => t.processing_state == 'todo');

    document.getElementById('todo').innerHTML = '';

    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        document.getElementById('todo').innerHTML += generateTodoHTML(element);
    }

    // In Progress
    let inProgress = tasks.filter(t => t.processing_state == 'inProgress');

    document.getElementById('inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('inProgress').innerHTML += generateTodoHTML(element);
    }

    //Testing
    let testing = tasks.filter(t => t.processing_state == 'testing');

    document.getElementById('testing').innerHTML = '';

    for (let index = 0; index < testing.length; index++) {
        const element = testing[index];
        document.getElementById('testing').innerHTML += generateTodoHTML(element);
    }

    // Done
    let done = tasks.filter(t => t.processing_state == 'done');

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('done').innerHTML += generateTodoHTML(element);
    }
}

function startDragging(creation_date) {
    currentDraggedElement = creation_date;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element.creation_date})" class="board-item" onclick="showBoardTask(${element.creation_date})">${element.title}<br><b>Due Date: </b>${element.due_date}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(processingState) {
    tasks.find(t => t.creation_date === currentDraggedElement).processing_state = processingState;
    updateHTML();
    await saveToBackend();
}


function hightlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

function showBoardTask(id) {

}