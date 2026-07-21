<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Shared\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class AdminUserRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_create_user_page(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get('/admin/users/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Create'));
    }

    public function test_bidder_cannot_open_create_user_page(): void
    {
        $bidder = User::factory()->create(['role' => UserRole::Bidder]);

        $this->actingAs($bidder)
            ->get('/admin/users/create')
            ->assertForbidden();
    }

    public function test_admin_can_create_user_from_create_page(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post('/admin/users', [
            'name' => 'Event Bidder',
            'email' => 'event-bidder@example.test',
            'password' => 'password123',
            'role' => 'bidder',
        ]);

        $response->assertRedirect('/admin/users');
        $response->assertSessionHas('success');

        $user = User::query()->where('email', 'event-bidder@example.test')->firstOrFail();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Event Bidder',
            'role' => 'bidder',
        ]);
        $this->assertDatabaseHas('wallets', [
            'user_id' => $user->id,
            'balance' => 0,
        ]);
    }

    public function test_admin_can_change_user_role(): void
    {
        $admin = User::factory()->admin()->create();
        $bidder = User::factory()->create(['role' => UserRole::Bidder]);

        $response = $this->actingAs($admin)->patch("/admin/users/{$bidder->id}/role", [
            'role' => 'admin',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('users', ['id' => $bidder->id, 'role' => 'admin']);
    }

    public function test_admin_can_demote_user_to_bidder(): void
    {
        $admin = User::factory()->admin()->create();
        $otherAdmin = User::factory()->create(['role' => UserRole::Admin]);

        $response = $this->actingAs($admin)->patch("/admin/users/{$otherAdmin->id}/role", [
            'role' => 'bidder',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $otherAdmin->id, 'role' => 'bidder']);
    }

    public function test_admin_cannot_change_own_role(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->patch("/admin/users/{$admin->id}/role", [
            'role' => 'bidder',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors('role');
        $this->assertDatabaseHas('users', ['id' => $admin->id, 'role' => 'admin']);
    }

    public function test_bidder_cannot_change_roles(): void
    {
        $bidder = User::factory()->create(['role' => UserRole::Bidder]);
        $user = User::factory()->create();

        $response = $this->actingAs($bidder)->patch("/admin/users/{$user->id}/role", [
            'role' => 'bidder',
        ]);

        $response->assertForbidden();
    }

    public function test_guest_cannot_access_role_endpoint(): void
    {
        $user = User::factory()->create();

        $response = $this->patch("/admin/users/{$user->id}/role", [
            'role' => 'bidder',
        ]);

        $response->assertRedirect('/login');
    }

    public function test_invalid_role_rejected(): void
    {
        $admin = User::factory()->admin()->create();
        $bidder = User::factory()->create(['role' => UserRole::Bidder]);

        $response = $this->actingAs($admin)->patch("/admin/users/{$bidder->id}/role", [
            'role' => 'superadmin',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors('role');
    }
}
