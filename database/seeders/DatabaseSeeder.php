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

        $bidders = collect([
            ['email' => 'bidder@jawara.test', 'google_id' => 'seed-bidder-google-id', 'name' => 'Jawara Bidder 1', 'balance' => 5_000_000],
            ['email' => 'bidder2@jawara.test', 'google_id' => 'seed-bidder-2-google-id', 'name' => 'Jawara Bidder 2', 'balance' => 5_000_000],
        ])->map(fn (array $bidder): User => User::query()->updateOrCreate(
            ['email' => $bidder['email']],
            [
                'name' => $bidder['name'],
                'google_id' => $bidder['google_id'],
                'password' => Hash::make('password'),
                'role' => UserRole::Bidder,
                'email_verified_at' => now(),
            ],
        ));

        Wallet::query()->firstOrCreate([
            'user_id' => $admin->id,
        ], [
            'balance' => 0,
        ]);

        $bidders->each(function (User $bidder, int $index): void {
            $bidderWallet = Wallet::query()->firstOrCreate([
                'user_id' => $bidder->id,
            ], [
                'balance' => 5_000_000,
            ]);

            WalletTransaction::query()->firstOrCreate([
                'reference' => $index === 0 ? 'seed-topup' : 'seed-topup-bidder-2',
            ], [
                'wallet_id' => $bidderWallet->id,
                'type' => TransactionType::TopUp,
                'amount' => 5_000_000,
                'balance_before' => 0,
                'balance_after' => 5_000_000,
                'notes' => 'Initial demo balance',
            ]);
        });

        $greenBean = GreenBean::query()->updateOrCreate([
            'name' => 'Gayo Wine Natural Lot A',
        ], [
            'origin' => 'Aceh Gayo',
            'process' => 'Natural',
            'weight_gram' => 10_000,
            'description' => 'Lot green beans natural process dari Aceh Gayo untuk demo live auction Jawara.',
            'starting_price' => 1_000_000,
            'bid_increment' => 100_000,
        ]);

        Auction::query()->updateOrCreate([
            'title' => 'Live Bid Gayo Wine Natural',
        ], [
            'green_bean_id' => $greenBean->id,
            'status' => AuctionStatus::Live,
            'current_price' => $greenBean->starting_price,
            'starts_at' => now()->subMinutes(10),
            'ends_at' => now()->addHours(2),
        ]);
    }
}
