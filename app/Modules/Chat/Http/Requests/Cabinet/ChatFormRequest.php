<?php

declare(strict_types=1);

namespace App\Modules\Chat\Http\Requests\Cabinet;

use App\Http\Requests\CommonRequest;

final class ChatFormRequest extends CommonRequest
{
    public function rules(): array
    {
        return [
            'text' => 'required|string|max:600',
            'client_id' => 'required|string',
        ];
    }
}
