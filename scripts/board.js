let todos = [
    {
        'id': 0,
        'title': 'Aufgabe-1',
        'category': 'open'
    },
    {
        'id': 1,
        'title': 'Aufgabe-2',
        'category': 'open'
    },
    {
        'id': 2,
        'title': 'Aufgabe-3',
        'category': 'closed'
    }
];

let currentDraggedElement;

function updateHTML() {

    // To Do
    let open = todos.filter(t => t['category'] == 'open');

    document.getElementById('open').innerHTML = '';

    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += gernerateTodoHTML(element);
    }

    // In Progress
    let closed = todos.filter(t => t['category'] == 'closed');

    document.getElementById('closed').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('closed').innerHTML += gernerateTodoHTML(element);
    }
    //Testing
    let testing = todos.filter(t => t['category'] == 'closed');

    document.getElementById('testing').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const element = open[index];
        document.getElementById('testing').innerHTML += gernerateTodoHTML(element);
    }
    // Done
    let done = todos.filter(t => t['category'] == 'closed');

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const element = open[index];
        document.getElementById('done').innerHTML += gernerateTodoHTML(element);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function gernerateTodoHTML(element) {
    return `<div draggable="true" ondragstart = "startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    updateHTML();
}

function hightlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighLight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}