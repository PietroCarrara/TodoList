<div id="{{ $id }}" class="modal
@if (isset($class))
    {{ $class }}
@endif">
        <div class="modal-content">
            {{ $slot }}
        </div>
        @if (isset($footer))
            <div class="modal-footer">
                {{ $footer }}
            </div>
        @endif
    </form>
</div>
