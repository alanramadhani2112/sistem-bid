<?php

declare(strict_types=1);

namespace App\Modules\Admin\Requests;

use App\Modules\Shared\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'role' => [
                'required',
                'string',
                Rule::in(array_map(static fn (UserRole $r): string => $r->value, UserRole::cases())),
            ],
        ];
    }
}
