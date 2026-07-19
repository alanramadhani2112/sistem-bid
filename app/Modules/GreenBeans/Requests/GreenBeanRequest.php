<?php

declare(strict_types=1);

namespace App\Modules\GreenBeans\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class GreenBeanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->can('access-admin');
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'origin' => ['required', 'string', 'max:255'],
            'process' => ['required', 'string', 'max:255'],
            'weight_gram' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'max:2048'],
            'starting_price' => ['required', 'integer', 'min:1000'],
            'bid_increment' => ['required', 'integer', 'min:1000'],
        ];
    }
}
