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
            <div class="card-content" id="grouping-task-box-{{ $grouping->id }}">
                <script>
                    var taskBox = new TaskBox(...@json($grouping->tasks));

                    document.getElementById('grouping-task-box-{{ $grouping->id }}')
                        .appendChild(taskBox.element);
                </script>
            </div>
        </div>
    </div>
</div>