<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Authentication\Services\AuthService;
use App\Modules\Shared\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

final class GoogleAuthServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_user_sync_creates_bidder_with_wallet(): void
    {
        $user = app(AuthService::class)->syncGoogleUser(SocialiteUser::fake([
            'id' => 'google-123',
            'name' => 'Green Bidder',
            'email' => 'green@example.test',
            'avatar' => 'https://example.test/avatar.png',
        ]));

        $this->assertSame('google-123', $user->google_id);
        $this->assertSame(UserRole::Bidder, $user->role);
        $this->assertNotNull($user->wallet);
        $this->assertSame(0, $user->wallet->balance);
    }

    public function test_google_user_sync_links_existing_email_without_changing_role(): void
    {
        $admin = User::factory()->admin()->create(['email' => 'admin@example.test']);

        $user = app(AuthService::class)->syncGoogleUser(SocialiteUser::fake([
            'id' => 'admin-google',
            'name' => 'Admin Google',
            'email' => 'admin@example.test',
        ]));

        $this->assertSame($admin->id, $user->id);
        $this->assertSame('admin-google', $user->google_id);
        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertNotNull($user->wallet);
    }
}
