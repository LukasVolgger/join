'use strict';

/**
 * Highlights the navigation elements from <aside> by URL
 */
function selectNavElement() {
    let url = window.location.href;
    let htmlPage = url.substr(url.lastIndexOf('/') + 1);
    // console.log(htmlSite);

    switch (htmlPage) {
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

/**
 * Redirects the user to the login.html page
 */
function logout() {
    window.location.href = '../login.html';
}