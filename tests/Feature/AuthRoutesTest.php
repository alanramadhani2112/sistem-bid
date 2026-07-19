<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class AuthRoutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_renders(): void
    {
        $this->get('/login')->assertOk();
    }

    public function test_dashboard_requires_auth(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_authenticated_user_can_open_dashboard(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/dashboard')->assertOk();
    }

    public function test_logout_clears_session(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/logout')->assertRedirect('/');
        $this->assertGuest();
    }
}
