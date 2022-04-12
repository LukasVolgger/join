'use strict';

let navElements = [
    '<a href="#" id="nav-element-0" onclick="selectNavElement(0)">Board</a>',
    '<a href="#" id="nav-element-1" onclick="selectNavElement(1)">Backlog</a>',
    '<a href="#" id="nav-element-2" onclick="selectNavElement(2)">Add Task</a>',
    '<a href="#" id="nav-element-3" onclick="selectNavElement(3)">Help</a>',
    '<a href="#" id="nav-element-4" onclick="selectNavElement(4)">About</a>'
]
let currentNavELement;


/**
 * Renders all nav-elements from array
 */
function renderNavElements() {
    let container = document.getElementById('nav-elements');
    container.innerHTML = '';

    for (let i = 0; i < navElements.length; i++) {
        container.innerHTML += navElements[i];
    }
}

/**
 * This function is used to highlight the selected nav-element
 * @param {integer} element 
 */
function selectNavElement(element) {
    document.getElementById(`nav-element-${element}`).classList.add('selected-nav-element');

    // De-select other nav elements
    for (let i = 0; i < navElements.length; i++) {
        if (element != i) {
            document.getElementById(`nav-element-${i}`).classList.remove('selected-nav-element');
        }
    }
}