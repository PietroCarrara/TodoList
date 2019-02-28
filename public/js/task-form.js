// Functions for the task form
var taskForm = {};

// Keep track of the created items
taskForm.items = [];

/**
 * Adds an item to a task
 * 
 * @param {Element} elem The button pressed to request a new item in a task
 */
taskForm.addItem = (elem) => {

    var root = document.createElement('div');
    root.classList.add('row', 'task-item');
    root.createdBy = elem;

    var col = root.appendChild(document.createElement('div'));
    col.classList.add('input-field', 'col', 's10');

    var item = col.appendChild(document.createElement('input'));
    item.type = 'text';
    item.name = 'items[]';
    item.placeholder = 'Descrição do passo...';

    var trash = root.appendChild(document.createElement('a'));
    trash.classList.add('btn-floating', 'btn-large', 'red', 'right');
    trash.innerHTML = '<i class="large material-icons">delete</i>';
    trash.onclick = () => {
        taskForm.remove(root);
    };

    elem.insertAdjacentElement('beforebegin', root);

    taskForm.items.push(root);
}

/**
 * Removes an item from a task
 * 
 * @param {Element} elem The item to be removed
 */
taskForm.remove = (elem) => {
    var items = [];

    for (var i of taskForm.items) {
        if (i != elem) {
            items.push(i);
        }
    }

    elem.parentElement.removeChild(elem);

    taskForm.items = items;
}

/**
 * Sends to the server a request to update the item completed state
 * 
 * @param {Number} itemId The id of the item
 * @param {Boolean} completed Is the item completed or not?
 */
taskForm.updateState = (itemId, completed) => {

    if (completed) {
        fetch(`/items/${itemId}/complete`, {
            // method: 'POST',
        });
    } else {
        fetch(`/items/${itemId}/uncomplete`, {
            // method: 'POST',
        });
    }
}