'use strict';


// ####################################### GLOBAL SCOPE #######################################


// Stores the id of an item to be moved
let currentDraggedElement;


// ####################################### MAIN FUNCTIONS #######################################


/**
 * Initialize needed functions for board.html
 */
async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    selectNavElement();
    showBoard();
}


/**
 * Displays the board by loading the different categories
 */
function showBoard() {
    showCategory('todo');
    showCategory('inProgress');
    showCategory('testing');
    showCategory('done');
}


/**
 * Displays a category of the board by filtering all tasks by processing status
 * @param {string} id - Passes the id of the category to be displayed
 */
function showCategory(id) {
    let category = tasks.filter(t => t.processing_state == id);
    document.getElementById(id).innerHTML = '';
    for (let index = 0; index < category.length; index++) {
        let task = category[index];
        let i = tasks.findIndex(t => t.creation_date == task.creation_date);
        document.getElementById(id).innerHTML += templateBoardItem(i);
    }
}


/**
 * When you start dragging an element, writes its id to the currentDraggedElement variable
 * @param {number} i - Passes the index of the task which should be dragged
 */
function drag(i) {
    currentDraggedElement = i;
}


/**
 * Prevent the element from being handled by default in order to allow a Drop
 * @param {*} ev - Passes the current event to the function
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Saves the new processing status in the backend after dropping an element into the respective field in the HTML file
 * @param {string} processingState - Passes the category of the HTML region over which the element was dropped
 */
async function drop(processingState) {
    tasks[currentDraggedElement].processing_state = processingState;
    await updateBoard();
}


/**
 * Highlight the HTML area over which the element is currently being dragged
 * @param {string} id - Passes the HTML-ID of the Area
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}


/**
 * Removes the highlighting of the HTML area 
 * @param {string} id - Passes the HTML-ID of the Area
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


/**
 * Removes a task from the board by setting the processing status to unallocated
 * @param {number} i - Passes the index of the task to be changed
 */
async function removeFromBoard(i) {
    tasks[i].processing_state = 'unallocated';
    closeDialog('dialog-bg-board');
    await updateBoard();
}


/**
 * Updates the board after something has been changed
 */
async function updateBoard() {
    showBoard();
    await saveToBackend();
}


/**
 * Generate dynamic HTML-Code for a board item
 * @param {number} i - Passes the index of the task which should be displayed
 * @returns {HTMLElement} Returns dynamic HTML-Code
 */
function templateBoardItem(i) {
    return `
        <div draggable="true" ondragstart="drag(${i})" class="board-item" onclick="showTask(${i}, 'board')">
            <div class="board-item-section">
                <span class="board-item-header">TITLE:</span>
                <span class="board-item-title">${tasks[i].title}</span>
            </div>
            <div class="board-item-section">
                <span class="board-item-header">DUE DATE:</span> 
                <span>${tasks[i].due_date}</span>
            </div>
        </div>
    `;
}