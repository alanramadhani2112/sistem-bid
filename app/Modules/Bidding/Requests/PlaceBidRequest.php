<?php

declare(strict_types=1);

namespace App\Modules\Bidding\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class PlaceBidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'integer', 'min:1'],
        ];
    }
}
