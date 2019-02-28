var __old_fetch__ = window.fetch;

window.fetch = function (url, options) {
    // If the X-Requested-With header is missing,
    // fill it, so Laravel recognizes it as an ajax request
    if (typeof options === 'undefined') {
        options = {};
    }
    if (typeof options.headers === 'undefined') {
        options.headers = {};
    }
    if (typeof options.headers['X-Requested-With'] === 'undefined') {
        options.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    // Get the csrf token.
    if (options.method == 'POST') {
        var meta = document.querySelector('meta[name="csrf-token"');
        if (meta == null) {
            console.error('No csrf token provided in <meta>!');
        } else {
            if (typeof options.body === 'undefined') {
                options.body = new FormData();
            } else if (options.body instanceof FormData) {
                options.body.append('_token', meta.content);
            } else {
                console.error('fetch-laravel requires options.body to be a FormData instace!');
            }
        }
    }

    return __old_fetch__(...arguments);
};
