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

ui.Form = (title, opts = {}) => {
    var form = document.createElement('form');
    form.classList.add('row');
    form.method = opts.method;
    form.action = opts.action;

    var header = form.appendChild(document.createElement('h4'));
    header.innerHTML = title;
    header.style.marginBottom = '3rem';

    form.appendChild(ui.Csrf());

    return form;
}

ui.Input = (type, opts = {}) => {

    opts.sizes = opts.sizes || ['s12'];

    var root = document.createElement('div');
    root.classList.add('input-field', 'col', ...opts.sizes);

    var inp = root.appendChild(document.createElement('input'));
    inp.type = type;
    inp.name = opts.name;
    if (opts.value) inp.value = opts.value;
    if (opts.label) {
        var label = root.appendChild(document.createElement('label'));
        label.innerHTML = opts.label;
        if (opts.value) {
            label.classList.add('active');
        }
    }

    return root;
}

ui.Checkbox = (text, opts = {}) => {

    opts.sizes = opts.sizes || ['s12'];

    var root = document.createElement('label');
    root.classList.add('input-field', 'col', ...opts.sizes);

    var inp = root.appendChild(document.createElement('input'));
    inp.type = 'checkbox';
    inp.name = opts.name;
    inp.checked = opts.checked;
    inp.disabled = opts.disabled;

    var span = root.appendChild(document.createElement('span'));
    span.append(text);

    return root;
}

ui.Csrf = () => {
    var meta = document.querySelector('meta[name="csrf-token"');
    if (meta == null) {
        throw 'No csrf token provided in <meta>!';
    } 

    var inp = document.createElement('input');
    inp.type = 'hidden';
    inp.value = meta.content;
    inp.name = '_token';

    return inp;
}

ui.Select = (opts = {}) => {

    opts.sizes = opts.sizes || ['s12'];

    var root = document.createElement('div');
    root.classList.add('input-field', 'col', ...opts.sizes);

    var select = root.appendChild(document.createElement('select'));
    select.name = opts.name;

    root.push = (arg) => select.append(arg);
    root.init = () => M.FormSelect.init(select);

    return root;
}

ui.Option = (text, opts = {}) => {

    var opt = document.createElement('option');
    opt.innerHTML = text;
    opt.value = opts.value;
    opt.disabled = opts.disabled;
    opt.selected = opts.selected;

    return opt;
}