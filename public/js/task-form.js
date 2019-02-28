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

    var trashCol = root.appendChild(document.createElement('div'));
    trashCol.classList.add('col', 's2');

    var trash = trashCol.appendChild(document.createElement('a'));
    trash.classList.add('btn-floating', 'red');
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
            method: 'POST',
        });
    } else {
        fetch(`/items/${itemId}/uncomplete`, {
            method: 'POST',
        });
    }
}

taskForm.icons = [
    'access_alarm',
    'account_balance',
    'account_balance_wallet',
    'account_box',
    'airplanemode_active',
    'archive',
    'attach_money',
    'audiotrack',
    'autorenew',
    'backup',
    'book',
    'brush',
    'build',
    'cake',
    'camera_alt',
    'casino',
    'chat',
    'child_friendly',
    'computer',
    'delete',
    'event',
    'filter_vintage',
    'fitness_center',
    'flag',
    'folder_shared',
    'format_paint',
    'free_breakfast',
    'gamepad',
    'grade',
    'home',
    'local_bar',
    'local_laundry_service',
    'local_movies',
    'local_pizza',
    'local_printshop',
    'location_on',
    'navigation',
    'pets',
    'power',
    'priority_high',
    'school',
    'sd_card',
    'speaker',
    'subway',
    'timer',
    'favorite',
];
/**
 * Pops up a icon selector modal and calls the callback with the selected icon
 * 
 * @param {function} callback Icon callback.
 */
taskForm.iconSelector = (callback) => {

    // Create the modal
    var root = document.createElement('div');
    root.classList.add('modal');

    var content = root.appendChild(document.createElement('div'))
    content.classList.add('modal-content');

    var title = content.appendChild(document.createElement('h4'));
    title.innerText = 'Selecione um ícone:';

    var container = content.appendChild(document.createElement('div'));
    container.classList.add('row', 'center');

    // Append each icon
    for (let icon of taskForm.icons) {
        var div = container.appendChild(document.createElement('div'));
        div.classList.add('col', 'm3', 's4');

        var i = div.appendChild(document.createElement('i'));
        i.classList.add('material-icons');
        i.style.cssText = 'cursor: pointer;';
        i.innerText = icon;

        i.onclick = () => {
            callback(icon);
            modal.close();
        }
    }

    document.body.appendChild(root);

    // Initialize the modal
    var modal = M.Modal.init(root, {
        onCloseEnd: () => {
            root.parentElement.removeChild(root);
        },
    });

    // Display the modal
    modal.open();
}

/**
 * Moves an task up on the client and then notifies the server
 * 
 * @param {Element} elem The element to move up
 * @param {Number} id The task id
 */
taskForm.moveUp = (elem, id) => { 
    // If we are the last ones, don't do anything
    if (elem.previousElementSibling == null) {
        return;
    }

    elem.parentElement.insertBefore(elem,elem.previousElementSibling);

    fetch(`/tasks/${id}/moveup`, {
        method: 'POST',
    });
}

/**
 * Moves an task down on the client and then notifies the server
 * 
 * @param {Element} elem The element to move down
 * @param {Number} id The task id
 */
taskForm.moveDown = (elem, id) => {
    // If we are the last ones, don't do anything
    if (elem.nextElementSibling == null) {
        return;
    }

    elem.parentElement.insertBefore(elem,elem.nextElementSibling.nextSibling);

    fetch(`/tasks/${id}/movedown`, {
        method: 'POST',
    });
}