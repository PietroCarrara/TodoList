@csrf
<input type="hidden" name="grouping_id" value="{{ $grouping->id }}">
<div class="input-field col s12">
    <input id="grouping-name" name="name" type="text">
    <label for="grouping-name">Nome da Tarefa</label>
</div>
<div class="col s12">
    <h5>Passos</h5>
    <a class="btn-floating waves-effect btn-large red right" onclick="taskForm.addItem(this)">
        <i class="large material-icons">add</i>
    </a>
</div>
@if (!(isset($hideBt) && $hideBt))
<div class="input-field col s12">
    <button type="submit" class="btn waves-effect">Salvar</button>
</div>
@endif