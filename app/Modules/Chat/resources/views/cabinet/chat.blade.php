@extends('layouts.cabinet')

@push ('custom_css')
    <link href="{{ asset('css/cabinet/chat/app.css') }}" rel="stylesheet">
    <link href="{{ asset('vendor/customTools/font-awesome/css/font-awesome.min.css') }}" rel="stylesheet">
    <link href="{{ asset('vendor/customTools/material-symbols/index.css') }}" rel="stylesheet">
@endpush

@section('content')
    <div class="conversation">
        <div class="message" id="messageBox"></div>

        <div class="reply">
            <textarea class="reply-input" rows="1" id="comment" placeholder="Message..." maxlength="600"></textarea>
            <div class="reply-meta">
                <button class="reply-send-btn disabled" id="sendBtn">
                    <i class="fa fa-send"></i>
                </button>
                <div class="reply-counter" id="counter">0 / 600</div>
            </div>
        </div>

    </div>
@endsection

@push ('scripts')
    <script src="{{ asset("js/cabinet/chat/app.min.js") }}" defer></script>
@endpush
