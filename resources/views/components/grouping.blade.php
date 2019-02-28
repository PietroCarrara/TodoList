<div class="row">
    <div class="col s12">
        <div class="card">
            <div class="card-image">
                <span class="card-title black-text">{{ $grouping->name }}</span>
                <a class="btn-floating halfway-fab waves-effect waves-light red modal-trigger"
                    href="#grouping-task-modal-{{ $grouping->id }}">
                    <i class="material-icons">add</i>
                </a>
            </div>
            <div class="card-content">
                @forelse($grouping->tasks as $task)
                @if ($loop->first)
                <ul class="collapsible popout z-depth-0">
                @endif
                    <li>
                        <div class="collapsible-header"><i class="material-icons">filter_drama</i>{{ $task->name }}
                        </div>
                        <div class="collapsible-body">
                            @foreach($task->items as $item)
                            <p>
                                <label>
                                    <input type="checkbox"
                                    onchange="taskForm.updateState('{{ $item->id }}', this.checked)"
                                    @if($item->completed)
                                        checked="checked"
                                    @endif
                                     />
                                    <span>{{ $item->desc }}</span>
                                </label>
                            </p>
                            @endforeach
                        </div>
                    </li>
                @if ($loop->last)
                </ul>
                @endif
                @empty
                <h5>Ainda não há tarefas nesse grupo :(</h5>
                @endforelse
            </div>
        </div>
    </div>
</div>