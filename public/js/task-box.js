class TaskBox {
    constructor(...tasks) {
        this.tasks = [];

        this.element = document.createElement('div');

        // <ul class="collapsible popout z-depth-0">
        this.body = this.element.appendChild(document.createElement('ul'));
        this.body.classList.add('collapsible', 'popout');

        for (var item of tasks) {
            var task = new Task(item);
            task.parent = this;
            this.tasks.push(task)
            this.body.appendChild(task.element);
        }

        if (tasks.length <= 0) {
            this.body.innerHTML = '<h5>Você não tem tarefas nesse grupo :(</h5>';
        }
    }

    /**
     * Adds a task to the box
     * @param {Task} task To be added.
     */
    add(task) {
        this.tasks.push(task);
        this.tasks = this.tasks.sort((a, b) => a.index > b.index);

        task.element.classList.add('animated', 'zoomInRight');
        task.element.addEventListener('animationend', () => {
            task.element.classList.remove('animated', 'fadeInLeft');
        });

        var index = this.tasks.indexOf(task);
        if (index >= this.tasks.length - 1) {
            this.body.appendChild(task.element);
        } else {
            this.body.insertBefore(task.element, this.tasks[index+1].element);
        }
    }

    /**
     * Removes a task from the box
     * @param {Task} task To be removed.
     */
    remove(task) {
        task.element.classList.add('animated', 'zoomOutRight');

        task.element.addEventListener('animationend', () => {
            task.element.parentElement.removeChild(task.element);
            task.element.classList.remove('animated', 'fadeOutRight');

            this.tasks = this.tasks.filter((i) => i != task).sort((a, b) => a.index > b.index);

            console.log(this.tasks);
        });
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
            check.onchange = (event) => this.onchange(item, event);
            if (item.completed) {
                check.checked = true;
            }

            var span = label.appendChild(document.createElement('span'));
            span.innerText = item.desc;
        }

        // Add action buttons
        var buttons = body.appendChild(document.createElement('div'));
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

    onchange(item, event) {
        this.completed = event.target.checked;

        if (this.completed) {
            fetch(`/items/${item.id}/complete`, {
                method: 'POST',
            });
        } else {
            fetch(`/items/${item.id}/uncomplete`, {
                method: 'POST',
            });
        }
    }

    moveUp() {
        // If we are the last ones, don't do anything
        if (this.element.previousElementSibling == null) {
            return;
        }

        this.element.parentElement.insertBefore(this.element, this.element.previousElementSibling);

        fetch(`/tasks/${this.id}/moveup`, {
            method: 'POST',
        });
    }

    moveDown() {
        // If we are the last ones, don't do anything
        if (this.element.nextElementSibling == null) {
            return;
        }

        this.element.parentElement.insertBefore(this.element, this.element.nextElementSibling.nextSibling);

        fetch(`/tasks/${this.id}/movedown`, {
            method: 'POST',
        });
    }
}