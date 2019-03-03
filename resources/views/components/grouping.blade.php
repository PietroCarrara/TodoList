<div class="row">
    <div class="col s12">
        <div class="card">
            <div class="card-image">
                <span class="card-title black-text">{{ $grouping->name }}</span>
            </div>
            <div class="card-content">
                <div class="right row">
                    {{-- Only show the 'Create Task' when we are seeing the active tasks --}}
                    @if (!isset($completed) || !$completed)
                        <a class="btn-floating waves-effect waves-light red modal-trigger"
                            href="#grouping-task-modal-{{ $grouping->id }}">
                            <i class="material-icons">add</i>
                        </a>
                    @endif
                    <a class="btn-floating waves-effect waves-light red modal-trigger"
                        href="#grouping-delete-modal-{{ $grouping->id }}">
                        <i class="material-icons">delete</i>
                    </a>
                </div>

                <div id="grouping-task-box-{{ $grouping->id }}" style="margin-top: 4rem;">
                </div>

                <script>

                    var tasks = [];

                    {{-- Show the correct group of tasks --}}
                    @if (isset($completed) && $completed)
                        var jsonData = @json($grouping->completeTasks());
                        for(var t of jsonData) {
                            tasks.push(new TaskCompleted(t));
                        }
                        var taskBox = new TaskBoxCompleted(@json($grouping), ...tasks);
                    @else
                        var jsonData = @json($grouping->incompleteTasks());
                        for(var t of jsonData) {
                            tasks.push(new Task(t));
                        }
                        var taskBox = new TaskBox(@json($grouping), ...tasks);
                    @endif

                    document.getElementById('grouping-task-box-{{ $grouping->id }}')
                        .appendChild(taskBox.element);
                </script>
            </div>
        </div>
    </div>
</div>