<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\GreenBean;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Modules\Shared\Enums\AuctionStatus;
use App\Modules\Shared\Enums\TransactionType;
use App\Modules\Shared\Enums\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

final class CoreSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_core_tables_and_enum_casts_exist(): void
    {
        $user = User::factory()->create(['role' => UserRole::Bidder]);
        $wallet = Wallet::factory()->create(['user_id' => $user->id, 'balance' => 2_000_000]);
        $transaction = WalletTransaction::factory()->create([
            'wallet_id' => $wallet->id,
            'type' => TransactionType::TopUp,
            'amount' => 2_000_000,
            'balance_before' => 0,
            'balance_after' => 2_000_000,
        ]);
        $greenBean = GreenBean::factory()->create(['starting_price' => 1_000_000]);
        $auction = Auction::factory()->live()->create([
            'green_bean_id' => $greenBean->id,
            'current_price' => 1_000_000,
        ]);
        $bid = Bid::factory()->create([
            'auction_id' => $auction->id,
            'user_id' => $user->id,
            'amount' => 1_100_000,
        ]);

        $this->assertSame(UserRole::Bidder, $user->refresh()->role);
        $this->assertSame(TransactionType::TopUp, $transaction->refresh()->type);
        $this->assertSame(AuctionStatus::Live, $auction->refresh()->status);
        $this->assertSame($wallet->id, $user->wallet->id);
        $this->assertSame($greenBean->id, $auction->greenBean->id);
        $this->assertSame($user->id, $bid->user->id);
        $this->assertFalse(Schema::hasColumn('wallet_transactions', 'updated_at'));
        $this->assertFalse(Schema::hasColumn('bids', 'updated_at'));
    }
}
