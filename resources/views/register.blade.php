@extends('layouts.main')

@section('content')

    @card(['title' => 'Registrar'])
        <form action="{{ route('register.post') }}" method="POST">
            @csrf
            <div class="input-field col s12">
                <input id="email" name="email" type="text">
                <label for="email">Email</label>
            </div>
            <div class="input-field col s12">
                <input id="password" name="password" type="password">
                <label for="password">Senha</label>
            </div>
            <div class="input-field col s12">
                <button type="submit" class="btn waves-effect">Criar Conta!</button>
            </div>
        </form>
        <span class="text-center"><a href="{{ route('login') }}">Já possui uma conta? Entre agora!</a></span>
    @endcard

@endsection
