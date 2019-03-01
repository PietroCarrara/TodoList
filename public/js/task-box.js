class TaskBox {
    constructor(...tasks) {
        this.tasks = [];

        // <ul class="collapsible popout z-depth-0">
        this.element = document.createElement('ul');
        this.element.classList.add('collapsible', 'popout');

        for (var item of tasks) {
            var task = new Task(item);
            this.tasks.push(task)
            this.element.appendChild(task.element);
        }

        if (tasks.length <= 0) {
            this.element.innerHTML = '<h5>Você não tem tarefas nesse grupo :(</h5>';
        }
    }
}

class Task {
    constructor(json) {
        this.id = json.id;
        this.icon = json.icon;
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
        if (event.target.checked) {
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