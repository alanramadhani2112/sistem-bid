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

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Jawara Admin',
            'email' => 'admin@jawara.test',
            'google_id' => 'seed-admin-google-id',
        ]);

        $bidder = User::factory()->create([
            'name' => 'Jawara Bidder',
            'email' => 'bidder@jawara.test',
            'google_id' => 'seed-bidder-google-id',
            'role' => UserRole::Bidder,
        ]);

        Wallet::factory()->create([
            'user_id' => $admin->id,
            'balance' => 0,
        ]);

        $bidderWallet = Wallet::factory()->create([
            'user_id' => $bidder->id,
            'balance' => 5_000_000,
        ]);

        WalletTransaction::factory()->create([
            'wallet_id' => $bidderWallet->id,
            'type' => TransactionType::TopUp,
            'amount' => 5_000_000,
            'balance_before' => 0,
            'balance_after' => 5_000_000,
            'reference' => 'seed-topup',
            'notes' => 'Initial demo balance',
        ]);

        $greenBean = GreenBean::factory()->create([
            'name' => 'Gayo Wine Natural Lot A',
            'origin' => 'Aceh Gayo',
            'process' => 'Natural',
            'weight_gram' => 10_000,
            'starting_price' => 1_000_000,
            'bid_increment' => 100_000,
        ]);

        Auction::factory()->create([
            'green_bean_id' => $greenBean->id,
            'title' => 'Live Bid Gayo Wine Natural',
            'status' => AuctionStatus::Published,
            'current_price' => $greenBean->starting_price,
            'starts_at' => now()->addHour(),
            'ends_at' => now()->addHours(2),
        ]);
    }
}
