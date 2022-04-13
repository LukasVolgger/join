'use strict';

let navElements = [
    '<a href="./board.html" id="nav-element-board">Board</a>',
    '<a href="./backlog.html" id="nav-element-backlog">Backlog</a>',
    '<a href="./index.html" id="nav-element-index">Add Task</a>',
    '<a href="./help.html" id="nav-element-help">Help</a>',
    '<a href="./about.html" id="nav-element-about">About</a>'
]

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
 */
function selectNavElement() {

    let url = window.location.href;
    let htmlSite = url.substr(url.lastIndexOf('/') + 1);
    // console.log(htmlSite);

    switch (htmlSite) {
        case 'board.html':
            document.getElementById('nav-element-board').classList.add('selected-nav-element');
            break;

        case 'backlog.html':
            document.getElementById('nav-element-backlog').classList.add('selected-nav-element');
            break;

        case 'index.html':
            document.getElementById('nav-element-index').classList.add('selected-nav-element');
            break;

        case 'index.html#':
            document.getElementById('nav-element-index').classList.add('selected-nav-element');
            break;

        case 'help.html':
            document.getElementById('nav-element-help').classList.add('selected-nav-element');
            break;

        case 'about.html':
            document.getElementById('nav-element-about').classList.add('selected-nav-element');
            break;
    }
}