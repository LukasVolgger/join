'use strict';

/**
 * Gets the user input and creates an object 
 */
function addTask() {
    let title = document.getElementById('task-title');
    let category = document.getElementById('task-category');
    let description = document.getElementById('task-description');
    let dueDate = document.getElementById('task-due-date');
    let urgency = document.getElementById('task-urgency');
    let assignedTo = document.getElementById('task-assigned-to');

    // Make sure all input forms have values
    if (title.value && category.value && description.value && dueDate.value && urgency.value && assignedTo.value) {
        let task = {
            'title': `${title.value}`,
            'category': `${category.value}`,
            'description': `${description.value}`,
            'due_date': `${dueDate.value}`,
            'urgency': `${urgency.value}`,
            'assigned_to': `${assignedTo.value}`,
            'processing_state': 'unallocated',
            'creation_date': new Date().getTime()
        };

        console.log(task);
        tasks.push(task);

        saveToBackend();

        // Reset input fields
        title.value = '';
        category.value = '';
        description.value = '';
        dueDate.value = '';
        urgency.value = '';
        assignedTo.value = '';

        // location.reload();
    }
}