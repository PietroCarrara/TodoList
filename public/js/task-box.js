var __groups__ = [];

class TaskBox {

    /**
     * Returns all TaskBoxes in the page
     */
    static getAll() {
        return __groups__;
    }

    /**
     * Compares two tasks. For use with Array.sort()
     * @param {Task} a Task a
     * @param {Task} b Task b
     */
    static orderTasks(a, b) {
        if (a.index < b.index) {
            return -1;
        }
        if (a.index > b.index) {
            return 1;
        }

        return 0;
    }

    constructor(info, ...tasks) {

        TaskBox.getAll().push(this);

        this.name = info.name;
        this.id = info.id;

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

        this.onchangeorder();
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
        this.tasks = this.tasks.sort(TaskBox.orderTasks);

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

            this.tasks = this.tasks.filter((i) => i != task).sort(TaskBox.orderTasks);

            if (this.tasks.length <= 0) {
                this.text.style.display = 'inherit';
            }

            task.element.removeEventListener('animationend', animationEnd);
        };

        task.element.addEventListener('animationend', animationEnd);
    }

    /**
     * Should be called everytime a tasks' index changes.
     * Orders the task array and hide buttons that would be useless
     */
    onchangeorder() {

        if (this.tasks.length <= 0) {
            return;
        }

        this.tasks = this.tasks.sort(TaskBox.orderTasks);

        // Reset every button
        for (var i = 0; i < this.tasks.length; i++) {
            this.tasks[i].show('moveUp', 'moveDown');
        }

        // The first task can't moveUp
        this.tasks[0].hide('moveUp');

        // The last task can't moveDown
        this.tasks[this.tasks.length - 1].hide('moveDown');
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
        this.bts = [];

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

        this.bts['moveUp'] = buttons.appendChild(ui.Button({
            classList: ['red'],
            icon: 'keyboard_arrow_up',
            onclick: () => this.moveUp(),
        }));

        this.bts['moveDown'] = buttons.appendChild(ui.Button({
            classList: ['red'],
            icon: 'keyboard_arrow_down',
            onclick: () => this.moveDown(),
        }));

        this.bts['delete'] = buttons.appendChild(ui.Button({
            classList: ['red'],
            icon: 'delete',
            onclick: () => this.delete(),
        }));

        this.bts['edit'] = buttons.appendChild(ui.Button({
            classList: ['red'],
            icon: 'edit',
            onclick: () => this.edit(),
        }));
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

    /**
     * Show the informed buttons
     * @param  {...string} bts Names of the buttons
     */
    show(...bts) {
        for (var bt of bts) {
            this.bts[bt].style.display = '';
        }
    }

    /**
     * Hide the informed buttons
     * @param  {...string} bts Names of the buttons
     */
    hide(...bts) {
        for (var bt of bts) {
            this.bts[bt].style.display = 'none';
        }
    }

    /**
     * Fired when an item changes
     * @param {Object} item The item that has been changed.
     * @param {Boolean} shouldDestroy If this task should trigger destroy() when all items are completed
     */
    onchange(item, shouldDestroy = true) {
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

        if (this.isComplete() && shouldDestroy) {
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

        ui.Notify(notifyText, callback);
    }

    /**
     * Moves this task up
     */
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

        this.parent.onchangeorder();

        // Notify the server
        fetch(`/tasks/${this.id}/moveup`, {
            method: 'POST',
        });
    }

    /**
     * Moves this task down
     */
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

        this.parent.onchangeorder();

        // Notify the server
        fetch(`/tasks/${this.id}/movedown`, {
            method: 'POST',
        });
    }

    /**
     * Delete this task
     */
    delete() {
        var modal = ui.Modal(`<h5>Isso irá <strong>permanentemente deletar</strong> a tarefa ${this.name}. Tem certeza?</h5>`, {
            buttons: [
                ui.Button({
                    type: 'btn',
                    classList: ['grey'],
                    onclick: () => modal.close(),
                    text: 'cancelar',
                }),
                ui.Button({
                    type: 'btn',
                    classList: ['red'],
                    text: '<strong>Deletar</strong>',
                    onclick: () => {
                        modal.close();
                        this.parent.remove(this);
                        fetch(`/tasks/${this.id}/delete`, {
                            method: 'POST',
                        });
                    },
                }),
            ]
        });

        modal.open();
    }

    /**
     * Open the modal to edit this task
     */
    edit() {
        var form = ui.Form(`Editando "${this.name}"`, {
            action: `/tasks/${this.id}/edit`,
            method: 'POST',
        });

        var top = form.appendChild(document.createElement('div'));
        top.classList.add('row');

        var icon = top.appendChild(document.createElement('input'));
        icon.type = 'hidden';
        icon.name = 'icon';
        icon.value = this.icon;

        top.appendChild(ui.Button({
            icon: this.icon,
            type: 'btn',
            classList: ['left'],
            onclick: (ev) => {
                taskForm.iconSelector((i) => {
                    icon.value = i;
                    ev.target.innerHTML = `<i class="material-icons">${i}</i>`;
                });
            },
        }))

        top.appendChild(ui.Input('text', {
            name: 'name',
            label: 'Nome',
            sizes: ['s10'],
            value: this.name,
        }));

        form.appendChild(document.createElement('h5'))
            .innerText = 'Grupo:';

        var select = form.appendChild(ui.Select({ name: 'grouping_id' }));
        for (var group of TaskBox.getAll()) {
            var opt = ui.Option(group.name, {
                value: group.id,
                selected: this.parent == group,
            });

            select.push(opt);
        }
        setTimeout(select.init, 100);

        form.appendChild(document.createElement('h5'))
            .innerText = 'Passos:';

        var items = form.appendChild(document.createElement('div'));

        // Make a item field with a name, isCompleted and a delete button
        function itemField(item = {}) {
            var div = document.createElement('div');
            div.classList.add('row');

            var text = ui.Input('text', {
                value: item.desc || '',
                label: 'Descrição do passo',
                name: 'items[]',
                sizes: ['s10'],
            })

            var bt = ui.Button({
                icon: 'delete',
                classList: ['red'],
                onclick: () => {
                    div.parentElement.removeChild(div);
                },
            });

            div.appendChild(text);
            div.appendChild(bt);

            return div;
        }

        for (var item of this.items) {
            items.appendChild(itemField(item));
        }

        form.appendChild(ui.Button({
            icon: 'add',
            classList: ['red', 'btn-large', 'right'],
            onclick: () => {
                items.appendChild(itemField());
            },
        }));

        var send = ui.Button({
            text: 'Salvar',
            classList: ['green'],
            type: 'btn',
            onclick: () => {
                form.submit();
            }
        })

        var modal = ui.Modal(form, {
            buttons: [
                send,
            ],
            onCloseEnd: () => modal.destroy(),
        });
        modal.open();

        return form;
    }
}