<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Shared\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class AdminUserRoleTest extends TestCase
{
    use RefreshDatabase;

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
