<div class="row">
    <div class="col s12">
        <div class="card
        @if (isset($class))
            {!! $class !!}
        @endif">
            <div class="card-content">
                <span class="card-title">{{ $title }}</span>
                <div class="row">
                    {{ $slot }}
                </div>
            </div>
            @if (isset($links))
            <div class="card-action">
                {{ $links }}
            </div>
            @endif
        </div>
    </div>
</div>