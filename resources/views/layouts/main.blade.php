<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script>
        var __old_fetch__ = window.fetch;

        window.fetch = (url, options) => {
            // If the X-Requested-With header is missing,
            // fill it, so Laravel recognizes it as an ajax request
            if (
            typeof options === 'undefined' ||
            typeof options.headers === 'undefined' ||
            typeof options.headers['X-Requested-With'] === 'undefined') {
                options.headers['X-Requested-With'] = 'XMLHttpRequest';
            }

            return __old_fetch__(...arguments);
        };
    </script>
</head>

<body>
    <div class="container">
        @yield('content')
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    {{-- Display errors as toasts --}}
    @if ($errors->any())
        <script>
            var errors = @json($errors->all());

            for (var err of errors) {
                M.toast({
                    html: err,
                    displayDuration: 4000,
                });
            }
        </script>
    @endif
    @yield('scripts')
</body>

</html>
