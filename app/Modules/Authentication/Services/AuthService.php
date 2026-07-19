<?php

declare(strict_types=1);

namespace App\Modules\Authentication\Services;

use App\Models\User;
use App\Models\Wallet;
use App\Modules\Shared\Enums\UserRole;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Two\User as SocialiteUser;

final class AuthService
{
    public function syncGoogleUser(SocialiteUser $googleUser): User
    {
        $googleId = (string) $googleUser->getId();
        $email = (string) $googleUser->getEmail();

        return DB::transaction(function () use ($googleUser, $googleId, $email): User {
            $user = User::query()
                ->where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if ($user === null) {
                $user = new User([
                    'email' => $email,
                    'role' => UserRole::Bidder,
                ]);
            }

            $user->forceFill([
                'name' => $googleUser->getName() ?: $email,
                'google_id' => $googleId,
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => $user->email_verified_at ?? now(),
            ])->save();

            Wallet::query()->firstOrCreate(
                ['user_id' => $user->id],
                ['balance' => 0],
            );

            return $user->refresh();
        });
    }
}
