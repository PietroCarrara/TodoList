class TaskBox {
    constructor(...tasks) {
        this.tasks = [];

        this.element = document.createElement('div');

        this.body = this.element.appendChild(document.createElement('ul'));
        this.body.classList.add('collapsible', 'popout');

        this.text = this.element.appendChild(document.createElement('h5'));
        this.text.innerText = 'Você concluiu todas as tarefas desse grupo :)';

        for (var task of tasks) {
            task.parent = this;
            this.tasks.push(task)
            this.body.appendChild(task.element);
        }

        if (tasks.length > 0) {
            this.text.style.display = 'none';
        }
    }

    /**
     * Adds a task to the box
     * @param {Task} task To be added.
     */
    add(task) {

        // Remove the "no tasks" warning
        this.text.style.display = 'none';

        task.parent = this;
        this.tasks.push(task);
        this.tasks = this.tasks.sort((a, b) => a.index > b.index);

        task.element.classList.add('animated', 'zoomInRight');

        var animationEnd = () => {
            task.element.classList.remove('animated', 'zoomInRight');
            task.element.removeEventListener('animationend', animationEnd);
        }
        task.element.addEventListener('animationend', animationEnd);

        var index = this.tasks.indexOf(task);
        if (index >= this.tasks.length - 1) {
            this.body.appendChild(task.element);
        } else {
            this.body.insertBefore(task.element, this.tasks[index + 1].element);
        }
    }

    /**
     * Removes a task from the box
     * @param {Task} task To be removed.
     */
    remove(task) {
        task.element.classList.add('animated', 'zoomOutRight');

        var animationEnd = () => {
            task.element.parentElement.removeChild(task.element);
            task.element.classList.remove('animated', 'zoomOutRight');

            this.tasks = this.tasks.filter((i) => i != task).sort((a, b) => a.index > b.index);

            if (this.tasks.length <= 0) {
                this.text.style.display = 'inherit';
            }

            task.element.removeEventListener('animationend', animationEnd);
        };

        task.element.addEventListener('animationend', animationEnd);
    }
}

class Task {
    constructor(json) {
        this.id = json.id;
        this.icon = json.icon;
        this.index = json.index;
        this.name = json.name;
        this.completed = json.completed;
        this.items = json.items || [];

        // Ceating the DOMElement
        var elem = this.element = document.createElement('li');

        this.element.task = this;

        var header = elem.appendChild(document.createElement('div'));
        header.classList.add('collapsible-header');
        header.innerHTML =
            `<i class="material-icons">${this.icon}</i>
            ${this.name}`;

        var body = elem.appendChild(document.createElement('div'));
        body.classList.add('collapsible-body');

        // Add each item
        for (let item of this.items) {
            var p = body.appendChild(document.createElement('p'));

            var label = p.appendChild(document.createElement('label'));

            var check = label.appendChild(document.createElement('input'));
            check.type = 'checkbox';
            check.onchange = () => this.onchange(item);
            if (item.completed) {
                check.checked = true;
            }
            item.check = check;

            var span = label.appendChild(document.createElement('span'));
            span.innerText = item.desc;
        }

        // Add action buttons
        var buttons = this.buttons = body.appendChild(document.createElement('div'));
        buttons.classList.add('right');

        var up = buttons.appendChild(document.createElement('a'));
        up.classList.add('waves-effect', 'red', 'btn-floating');
        up.innerHTML = '<i class="material-icons">keyboard_arrow_up</i>'
        up.onclick = () => this.moveUp();

        var down = buttons.appendChild(document.createElement('a'));
        down.classList.add('waves-effect', 'red', 'btn-floating');
        down.innerHTML = '<i class="material-icons">keyboard_arrow_down</i>';
        down.onclick = () => this.moveDown();
    }

    /**
     * Check if every item is complete
     */
    isComplete() {
        for (var item of this.items) {
            if (!item.completed) {
                return false;
            }
        }

        return true;
    }

    onchange(item) {
        item.completed = item.check.checked;

        if (item.completed) {
            fetch(`/items/${item.id}/complete`, {
                method: 'POST',
            });
        } else {
            fetch(`/items/${item.id}/uncomplete`, {
                method: 'POST',
            });
        }

        if (this.isComplete()) {
            this.destroy(`A tarefa <strong>${this.name}</strong> foi completa.`, () => {
                // Reset our items if the user cancels the completion
                for (var i of this.items) {
                    i.check.checked = false;
                    this.onchange(i);
                }

                // If the animation is still rolling, we wait for it
                // If it is not, just play the "comeback" animation
                if (this.element.classList.contains('animated')) {
                    var animationEnd = () => {
                        this.element.removeEventListener('animationend', animationEnd);
                        this.parent.add(this);
                    }
                    this.element.addEventListener('animationend', animationEnd);
                } else {
                    this.parent.add(this);
                }
            });
        }
    }

    /**
     * Destroy this task and notify the user
     * @param {String} notifyText The notification text to be displayed.
     * @param {function} callback Function to call when the 'Undo' button is clicked.
     */
    destroy(notifyText, callback) {
        this.parent.remove(this);

        // Notify the completion of this task
        var root = document.createElement('div');
        var text = root.appendChild(document.createElement('span'));
        text.innerHTML = notifyText;

        // Button that undoes the task completion
        var bt = root.appendChild(document.createElement('a'));
        bt.innerText = 'Desfazer';
        bt.classList.add('btn-flat', 'toast-action');
        bt.onclick = () => {
            callback();
            toast.dismiss();
        }
        var toast = M.toast({
            html: root,
        });
    }

    moveUp() {
        // If we are the first ones, don't do anything
        if (this.element.previousElementSibling == null) {
            return;
        }

        var elem = this.element.previousElementSibling;

        // Switch indexes
        var idx = this.index;
        this.index = elem.task.index;
        elem.task.index = idx;

        this.element.parentElement.insertBefore(this.element, elem);

        fetch(`/tasks/${this.id}/moveup`, {
            method: 'POST',
        });
    }

    moveDown() {
        // If we are the last ones, don't do anything
        if (this.element.nextElementSibling == null) {
            return;
        }

        var elem = this.element.nextElementSibling;

        // Switch indexes
        var idx = this.index;
        this.index = elem.task.index;
        elem.task.index = idx;

        this.element.parentElement.insertBefore(this.element, elem.nextSibling);

        fetch(`/tasks/${this.id}/movedown`, {
            method: 'POST',
        });
    }
}