let todos = [
    {
        'id': 0,
        'title': 'Aufgabe-1',
        'category': 'todo'
    },
    {
        'id': 1,
        'title': 'Aufgabe-2',
        'category': 'todo'
    },
    {
        'id': 2,
        'title': 'Aufgabe-3',
        'category': 'todo'
    }
];

let currentDraggedElement;

function updateHTML() {

    // To Do
    let todo = todos.filter(t => t['category'] == 'todo');

    document.getElementById('todo').innerHTML = '';

    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        document.getElementById('todo').innerHTML += gernerateTodoHTML(element);
    }

    // In Progress
    let inProgress = todos.filter(t => t['category'] == 'inProgress');

    document.getElementById('inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('inProgress').innerHTML += gernerateTodoHTML(element);
    }
    //Testing
    let testing = todos.filter(t => t['category'] == 'testing');

    document.getElementById('testing').innerHTML = '';

    for (let index = 0; index < testing.length; index++) {
        const element = testing[index];
        document.getElementById('testing').innerHTML += gernerateTodoHTML(element);
    }
    // Done
    let done = todos.filter(t => t['category'] == 'done');

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
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
