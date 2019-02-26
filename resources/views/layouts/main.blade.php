<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
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
