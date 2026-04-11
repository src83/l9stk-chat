<?php

use App\Modules\Chat\Http\Controllers\Cabinet\Ajax\MessageController;
use App\Modules\Chat\Http\Controllers\Cabinet\ChatController;
use Illuminate\Support\Facades\Route;

/**
 * Chat module
 */
Route::group([
    'prefix' => 'chat',
], static function () {
    Route::get('/', [ChatController::class, 'index'])->name('chat');
});

/**
 * Ajax-маршруты
 * http://l9stk.loc/cabinet/chat/ajax
 */
Route::group([
    'prefix' => 'chat/ajax',
], static function () {
    Route::get('/messages', [MessageController::class, 'index'])->name('chat.ajax.messages.index');
    Route::post('/messages', [MessageController::class, 'create'])->name('chat.ajax.messages.create');
});
