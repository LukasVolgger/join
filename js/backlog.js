'use strict';


/**
 * Initialize needed functions for backlog.html
 */
async function init() {
    includeHTML();
    await downloadFromServer();
    await loadFromBackend();
    selectNavElement();
    showBacklog();
}


/**
 * Show all unallocated Tasks
 */
function showBacklog() {
    let content = document.getElementById('backlog-content');
    content.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].processing_state == 'unallocated') {
            content.innerHTML += templateBacklogItem(i);
        }
    }
}


/**
 * Allows you to move an item to the board by changing the processing status to todo
 * @param {number} i - Passes the index of the task to be changed
 */
async function moveToBoard(i) {
    tasks[i].processing_state = 'todo';
    closeDialog('dialog-bg-backlog');
    await updateBacklog();
}


/**
 * Updates the backlog after something has been changed
 */
async function updateBacklog() {
    showBacklog();
    await saveToBackend();
}


/**
 * Generate dynamic HTML-Code for a backlog item
 * @param {number} i - Passes the index of the task which should be displayed
 * @returns {HTMLElement} Returns dynamic HTML-Code
 */
function templateBacklogItem(i) {
    return `
        <div class="backlog-item ${tasks[i].category}" id="backlog-item-${i}" onclick="showTask(${i}, 'backlog')">
            <div class="backlog-item-assigned">
                <span class="mobile-only-backlog">ASSIGNED TO:</span>
                <div class="person">
                    <img class="rounded-circle profile-picture" src="../assets/img/pp_${tasks[i].assigned_to}.jfif" alt="">
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