<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Requests;

use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class AuctionStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->can('access-admin');
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(AuctionStatus::class)],
        ];
    }
}
