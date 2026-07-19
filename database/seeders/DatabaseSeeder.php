<?php

namespace Database\Seeders;

use App\Models\Auction;
use App\Models\GreenBean;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Modules\Shared\Enums\AuctionStatus;
use App\Modules\Shared\Enums\TransactionType;
use App\Modules\Shared\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@jawara.test'],
            [
                'name' => 'Jawara Admin',
                'google_id' => 'seed-admin-google-id',
                'password' => Hash::make('password'),
                'role' => UserRole::Admin,
                'email_verified_at' => now(),
            ],
        );

        $bidder = User::query()->updateOrCreate(
            ['email' => 'bidder@jawara.test'],
            [
                'name' => 'Jawara Bidder',
                'google_id' => 'seed-bidder-google-id',
                'password' => Hash::make('password'),
                'role' => UserRole::Bidder,
                'email_verified_at' => now(),
            ],
        );

        Wallet::query()->firstOrCreate([
            'user_id' => $admin->id,
        ], [
            'balance' => 0,
        ]);

        $bidderWallet = Wallet::query()->firstOrCreate([
            'user_id' => $bidder->id,
        ], [
            'balance' => 5_000_000,
        ]);

        WalletTransaction::query()->firstOrCreate([
            'reference' => 'seed-topup',
        ], [
            'wallet_id' => $bidderWallet->id,
            'type' => TransactionType::TopUp,
            'amount' => 5_000_000,
            'balance_before' => 0,
            'balance_after' => 5_000_000,
            'notes' => 'Initial demo balance',
        ]);

        $greenBean = GreenBean::query()->firstOrCreate([
            'name' => 'Gayo Wine Natural Lot A',
        ], [
            'origin' => 'Aceh Gayo',
            'process' => 'Natural',
            'weight_gram' => 10_000,
            'starting_price' => 1_000_000,
            'bid_increment' => 100_000,
        ]);

        Auction::query()->firstOrCreate([
            'title' => 'Live Bid Gayo Wine Natural',
        ], [
            'green_bean_id' => $greenBean->id,
            'status' => AuctionStatus::Published,
            'current_price' => $greenBean->starting_price,
            'starts_at' => now()->addHour(),
            'ends_at' => now()->addHours(2),
        ]);
    }
}
