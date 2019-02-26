@extends('layouts.main')

@section('content')

    @card(['title' => 'Login'])
        <form action="{{ route('login.post') }}" method="POST">
            @csrf
            <div class="input-field col s12">
                <input id="email" name="email" type="text" class="validate">
                <label for="email">Email</label>
            </div>
            <div class="input-field col s12">
                <input id="password" name="password" type="text" class="validate">
                <label for="password">Senha</label>
            </div>
            <div class="input-field col s12">
                <button type="submit" class="btn waves-effect">Entrar!</button>
            </div>
        </form>
        <span class="text-center"><a href="{{ route('register') }}">Ainda não possui uma conta? Crie uma agora!</a></span>
    @endcard

@endsection