<?php

namespace App\Modules\Chat\Repositories;

use App\Modules\Chat\Models\Message;
use Illuminate\Support\Collection;

class MessageRepository
{
    public function create(array $data): ?Message
    {
        $message = new Message;
        $message->fill($data);
        $message->save();

        return $message;
    }

    public function latest(int $limit = 200, ?int $lastId = null): ?Collection
    {
        $query = Message::with('user:id,name')
            ->orderByDesc('id')
            ->limit($limit);

        if ($lastId) {
            $query->where('id', '>', $lastId);
        }

        return $query->get()->reverse()->values();
    }
}
