@csrf
<div class="input-field col s12">
    <input id="grouping-name" name="name" type="text">
    <label for="grouping-name">Nome do Grupo</label>
</div>
@if (!(isset($hideBt) && $hideBt))
<div class="input-field col s12">
    <button type="submit" class="btn waves-effect">Salvar</button>
</div>
@endif