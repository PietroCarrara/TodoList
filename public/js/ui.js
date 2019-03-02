var ui = {}

ui.Button = (opts) => {

    // Default button type
    opts.type = opts.type || 'btn-floating';

    var bt = document.createElement('a');
    bt.classList.add('waves-effect', opts.type);

    if (opts.classList) {
        bt.classList.add(...opts.classList);
    }

    if (opts.text) {
        bt.innerHTML = opts.text;
    } else if (opts.icon) {
        bt.innerHTML = `<i class="material-icons">${opts.icon}</i>`;
    } else {
        throw 'No text or icon provided for ui.Button!';
    }

    if (opts.href) {
        bt.href = opts.href;
    } else if (opts.onclick) {
        bt.onclick = opts.onclick;
    }

    return bt;
}

ui.Notify = (notifyText, callback) => {
    // Notify the completion of this task
    var root = document.createElement('div');
    var text = root.appendChild(document.createElement('span'));
    text.innerHTML = notifyText;

    // Button that undoes the task completion
    if (callback) {
        root.appendChild(ui.Button({
            classList: ['toast-action'],
            type: 'btn-flat',
            text: 'Desfazer',
            onclick: () => {
                callback();
                toast.dismiss();
            },
        }));
    }
    var toast = M.toast({
        html: root,
    });
}

/**
 * Builds a modal
 * 
 * @param {Element|String} content The body of the modal.
 * @param {Object} opts Optional parameters.
 */
ui.Modal = (content = null, opts = {}) => {

    var root = document.createElement('div');
    root.classList.add('modal');

    if (typeof content === 'string') {
        var tmp = document.createElement('p');
        tmp.classList.add('modal-content');
        tmp.innerHTML = content;
        content = tmp;
    } else if (content instanceof Element) {
        content.classList.add('modal-content');
    } else {
        throw 'content must be a String or a Element for ui.Modal!';
    }
    root.appendChild(content);

    if (opts.buttons) {
        var footer = root.appendChild(document.createElement('div'));
        footer.classList.add('modal-footer');
        footer.append(...opts.buttons);
    }


    // Initialize the modal
    document.body.appendChild(root);
    return M.Modal.init(root, {
        onCloseEnd: opts.onCloseEnd,
    });
}