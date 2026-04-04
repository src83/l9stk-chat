<?php

namespace App\Modules\Chat\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Support\Renderable;

class ChatController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {}

    /**
     * Show the application dashboard.
     */
    public function index(): Renderable
    {
        return view('chat::cabinet.chat');
    }
}
