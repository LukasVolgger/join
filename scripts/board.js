
//currently not working

let currentDraggedElement;

function updateHTML() {

    // To Do
    let todo = tasks.filter(t => t['processing-state'] == 'todo');

    document.getElementById('todo').innerHTML = '';

    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        document.getElementById('todo').innerHTML += generateTodoHTML(element);
    }

    // In Progress
    let inProgress = tasks.filter(t => t['processing-state'] == 'inProgress');

    document.getElementById('inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('inProgress').innerHTML += generateTodoHTML(element);
    }
    //Testing
    let testing = tasks.filter(t => t['processing-state'] == 'testing');

    document.getElementById('testing').innerHTML = '';

    for (let index = 0; index < testing.length; index++) {
        const element = testing[index];
        document.getElementById('testing').innerHTML += generateTodoHTML(element);
    }
    // Done
    let done = tasks.filter(t => t['processing-state'] == 'done');

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('done').innerHTML += generateTodoHTML(element);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging" style"width: 50px; height: 20px; backgroundcolor: black"; color: white;>${element.title}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['processing-state'] = category;
    updateHTML();
}


function hightlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighLight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}
