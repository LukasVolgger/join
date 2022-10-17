'use strict';

/**
 * Highlights the navigation elements from <aside> by URL
 */
function selectNavElement() {
    let url = window.location.href;
    let htmlPage = url.substr(url.lastIndexOf('/') + 1);
    // console.log(htmlPage);

    let done = false;

    let interval = setInterval(() => {
        if (htmlPage == 'board.html' && document.getElementById('nav-element-board')) {
            document.getElementById('nav-element-board').classList.add('selected-nav-element');
            done = true;
        }

        if (htmlPage == 'backlog.html' && document.getElementById('nav-element-backlog')) {
            document.getElementById('nav-element-backlog').classList.add('selected-nav-element');
            done = true;
        }

        if (htmlPage == 'add_task.html' && document.getElementById('nav-element-add_task')) {
            document.getElementById('nav-element-add_task').classList.add('selected-nav-element');
            done = true;
        }

        if (htmlPage == 'help.html' && document.getElementById('nav-element-help')) {
            document.getElementById('nav-element-help').classList.add('selected-nav-element');
            done = true;
        }

        if (htmlPage == 'about.html' && document.getElementById('nav-element-about')) {
            document.getElementById('nav-element-about').classList.add('selected-nav-element');
            done = true;
        }

        if (done) {
            clearInterval(interval);
        }

        // console.log('Interval running');
    }, 100);
}

/**
 * Redirects the user to the login.html page
 */
function logout() {
    window.location.href = '../index.html';
}

/**
 * Toggles the mobile menu on/off
 */
function toggleMobileMenu() {
    document.getElementById('sidebar').classList.toggle('mobile-menu-hidden');
    document.getElementById('sidebar').classList.toggle('mobile-menu-visible');
    document.body.classList.toggle('scrolling-not-allowed');
}