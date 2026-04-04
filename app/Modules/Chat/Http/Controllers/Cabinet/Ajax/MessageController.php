<?php

namespace App\Modules\Chat\Http\Controllers\Cabinet\Ajax;

use App\Http\Controllers\Controller;

use App\Modules\Chat\Http\Requests\Cabinet\ChatFormRequest;
use App\Modules\Chat\Repositories\MessageRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    protected MessageRepository $messageRepository;

    public function __construct(
        MessageRepository $messageRepository
    ) {
        $this->messageRepository = $messageRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $lastId = $request->integer('last_id');
        $messages = $this->messageRepository->latest(200, $lastId);

        return response()->json([
            'messages' => $messages,
        ]);
    }

    public function create(ChatFormRequest $request): JsonResponse
    {
        $text = $request->validated('text');
        $clientId = $request->validated('client_id');

        $data = [
            'user_id' => auth()->id(),
            'client_id' => trim($clientId),
            'text'    => trim($text),
            'status'  => 'sent',
        ];

        $message = $this->messageRepository->create($data);

        $msgPayload = $message?->load('user:id,name');

        return response()->json([
            'code_http' => 201,
            'code_text' => 'Created',
            'message_key' => 'chat.post_created',
            'data' => $msgPayload,
        ], 201);
    }
}
