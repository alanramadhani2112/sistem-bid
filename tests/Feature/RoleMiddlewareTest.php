<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Shared\Enums\UserRole;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

final class RoleMiddlewareTest extends TestCase
{
    public function test_admin_role_can_access_admin_route(): void
    {
        Route::middleware('role:admin')->get('/_test/admin-only', fn () => 'ok');

        $user = new User([
            'name' => 'Admin',
            'email' => 'admin@example.test',
            'password' => 'password',
            'role' => UserRole::Admin,
        ]);

        $this->actingAs($user)->get('/_test/admin-only')->assertOk();
        $this->assertTrue(Gate::forUser($user)->allows('access-admin'));
    }

    public function test_bidder_role_cannot_access_admin_route(): void
    {
        Route::middleware('role:admin')->get('/_test/admin-only-denied', fn () => 'ok');

        $user = new User([
            'name' => 'Bidder',
            'email' => 'bidder@example.test',
            'password' => 'password',
            'role' => UserRole::Bidder,
        ]);

        $this->actingAs($user)->get('/_test/admin-only-denied')->assertForbidden();
        $this->assertFalse(Gate::forUser($user)->allows('access-admin'));
    }
}
