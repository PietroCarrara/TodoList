class TaskBoxCompleted extends TaskBox {
    constructor() {
        super(...arguments);

        this.text.innerText = 'Você não concluiu nenhuma tarefa desse grupo :(';
    }
}

class TaskCompleted extends Task {

    constructor() {
        super(...arguments);

        for (var item of this.items) {
            item.check.disabled = true;
        }

        // Button to reactivate a task
        this.buttons.appendChild(ui.Button({
            classList: ['green'],
            icon: 'unarchive',
            onclick: () => {
                for (var i of this.items) {
                    // Uncheck erevything
                    i.check.checked = false;
                    super.onchange(i);
                }

                this.destroy(`A tarefa <strong>${this.name}</strong> foi re-ativada.`, () => {
                    for (var i of this.items) {
                        // Recomplete everything if the user cancels it
                        i.check.checked = true;
                        super.onchange(i, false);
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
                })
            }
        }));
    }

    onchange() {

    }
}