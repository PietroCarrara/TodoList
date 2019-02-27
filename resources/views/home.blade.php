@extends('layouts.main')

@section('content')
<h1>Suas Tarefas</h1>

<div class="row">
    <div class="carousel col s12">
        @foreach(Auth::user()->groupings as $grouping)
        <div class="carousel-item col s10 m6">
            @include('components.grouping')
        </div>
        @endforeach
    </div>
</div>
<div id="group-modal" class="modal">
    <form action="{{ route('grouping.create') }}" method="POST">
        <div class="modal-content">
            <h4>Criar grupo</h4>
            <small>Um grupo é como uma pasta: serve para juntar tarefas que tenham algo em comum (ex. Trabalho, Afazeres
                da
                Casa, ...)</small>

            <div class="row">
                @include('components.forms.grouping', ['hideBt' => true])
            </div>
        </div>
        <div class="modal-footer">
            <button class="waves-effect btn waves-green" type="submit">Criar</button>
            <a href="#!" class="modal-close waves-effect waves-grey btn-flat">Cancelar</a>
        </div>
    </form>
</div>

<div class="fixed-action-btn">
    <a class="btn-floating btn-large red modal-trigger" href="#group-modal">
        <i class="large material-icons">add</i>
    </a>
</div>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        var modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);

        var carousels = document.querySelectorAll('.carousel');
        M.Carousel.init(carousels);
    });
</script>
@endsection