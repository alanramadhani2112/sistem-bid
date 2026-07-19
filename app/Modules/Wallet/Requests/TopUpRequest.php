<?php

declare(strict_types=1);

namespace App\Modules\Wallet\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class TopUpRequest extends FormRequest
{
    private const MIN_AMOUNT = 10_000;

    private const MAX_AMOUNT = 100_000_000;

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'integer', 'min:'.self::MIN_AMOUNT, 'max:'.self::MAX_AMOUNT],
        ];
    }
}
