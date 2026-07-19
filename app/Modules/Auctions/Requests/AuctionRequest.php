<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Requests;

use App\Models\GreenBean;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class AuctionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->can('access-admin');
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        return [
            'green_bean_id' => ['required', 'integer', Rule::exists(GreenBean::class, 'id')],
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::enum(AuctionStatus::class)],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
        ];
    }
}
