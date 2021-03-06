<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css">
    <script src="{{ asset('js/ui.js') }}"></script>
    <script src="{{ asset('js/fetch-laravel.js') }}"></script>
    <script src="{{ asset('js/task-box.js') }}"></script>
    <script src="{{ asset('js/task-box-completed.js') }}"></script>
</head>

<body>
    <header>
        <div class="navbar-fixed">
            <nav>
                <div class="nav-wrapper">
                    <a href="{{ route('home') }}" class="brand-logo">TodoList</a>
                    <a href="#" data-target="mobile-nav" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                    <ul class="right hide-on-med-and-down">
                        @auth
                        <li><a href="{{ route('home') }}">Tarefas Ativas</a></li>
                        <li><a href="{{ route('completed') }}">Tarefas Concluídas</a></li>
                        <li><a href="{{ route('logout') }}">Logout</a></li>
                        @else
                        <li><a href="{{ route('register') }}">Registrar</a></li>
                        <li><a href="{{ route('login') }}">Login</a></li>
                        @endauth

                    </ul>
                </div>
            </nav>
        </div>
        <ul class="sidenav" id="mobile-nav">
            @auth
            <li><a href="{{ route('home') }}">Tarefas Ativas</a></li>
            <li><a href="{{ route('completed') }}">Tarefas Concluídas</a></li>
            <li><a href="{{ route('logout') }}">Logout</a></li>
            @else
            <li><a href="{{ route('register') }}">Registrar</a></li>
            <li><a href="{{ route('login') }}">Login</a></li>
            @endauth
        </ul>
    </header>


    <main>
        <div class="container">
            @yield('content')
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        {{-- Display errors as toasts --}}
        @if ($errors->any())
        <script>
            var errors = @json($errors -> all());

            for (var err of errors) {
                M.toast({
                    html: err,
                    displayDuration: 4000,
                });
            }
        </script>
        @endif
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                M.AutoInit();
            });
        </script>
        @yield('scripts')
    </main>

    <footer>

    </footer>
</body>

</html>