@extends('layouts.main')

@section('content')
<div class="row" style="z-index: -1;">
        @forelse(Auth::user()->groupings as $grouping)
            @if ($loop->first)
                <div class="carousel col s12" style="overflow-y: visible;">
            @endif
                <div class="carousel-item col s11 m6 grouping-item">
                    @include('components.grouping')
                </div>
            @if ($loop->last)
                </div>
            @endif
        @empty
            <div class="center">
                <h5>Você não criou nenhum grupo ainda! :(</h5>
            </div>
        @endforelse
    </div>
</div>

@foreach(Auth::user()->groupings as $grouping)
<form action="{{ route('task.create') }}" method="POST">
    @modal(['id' => "grouping-task-modal-$grouping->id", 'class' => 'grouping-task-modal'])
    <h4>{{ $grouping->name }}</h4>
    <h5>Criar Tarefa</h5>
    <small>Uma tarefa representa alguma coisa que deve ser cumprida, decomposta em alguns passos menores.</small>

    <div class="row">
        @include('components.forms.task', [
        'hideBt' => true,
        'grouping' => $grouping,
        ])
    </div>
    @slot('footer')
    <button class="waves-effect btn waves-green" type="submit">Criar</button>
    <a href="#!" class="modal-close waves-effect waves-grey btn-flat">Cancelar</a>
    @endslot
    @endmodal
</form>
@endforeach

<form action="{{ route('grouping.create') }}" method="POST">
    @modal(['id' => 'group-modal'])
    <h4>Criar grupo</h4>
    <small>Um grupo é como uma pasta: serve para juntar tarefas que tenham algo em comum
        (ex. Trabalho, Afazeres da Casa, ...)</small>

    <div class="row">
        @include('components.forms.grouping', ['hideBt' => true])
    </div>
    @slot('footer')
    <button class="waves-effect btn waves-green" type="submit">Criar</button>
    <a href="#!" class="modal-close waves-effect waves-grey btn-flat">Cancelar</a>
    @endslot
    @endmodal
</form>

<div class="fixed-action-btn">
    <a class="btn-floating btn-large red modal-trigger" href="#group-modal">
        <i class="large material-icons">add</i>
    </a>
</div>
@endsection

@section('scripts')
<script src="{{ asset('js/task-form.js') }}"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    var elems = document.querySelectorAll('.grouping-task-modal');
    var instances = M.Modal.init(elems, {
        // Clear the modal on closing
        onCloseEnd: (elem) => {
            for (var i of elem.querySelectorAll('.task-item')) {
                i.parentElement.removeChild(i);
            }
            for (var i of elem.querySelectorAll('input[type="text"]')) {
                i.value = '';
            }
        },
    });
});
</script>
@endsection