<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\GreenBean;
use App\Models\User;
use App\Models\Wallet;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class BiddingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_place_valid_bid_without_wallet_deduction(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->create(['balance' => 2_000_000]);
        $auction = $this->liveAuction(currentPrice: 1_000_000);

        $response = $this->actingAs($user)->post("/auctions/{$auction->id}/bids", ['amount' => 1_100_000]);

        $response->assertRedirect();
        $this->assertDatabaseHas(Bid::class, [
            'auction_id' => $auction->id,
            'user_id' => $user->id,
            'amount' => 1_100_000,
        ]);
        $this->assertSame(1_100_000, $auction->refresh()->current_price);
        $this->assertSame(2_000_000, $user->wallet->refresh()->balance);
    }

    public function test_bid_requires_live_auction(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->create(['balance' => 2_000_000]);
        $auction = $this->liveAuction(status: AuctionStatus::Published);

        $this->actingAs($user)
            ->from("/auctions/{$auction->id}")
            ->post("/auctions/{$auction->id}/bids", ['amount' => 1_100_000])
            ->assertRedirect("/auctions/{$auction->id}")
            ->assertSessionHasErrors('amount');
    }

    public function test_bid_rejects_ended_auction(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->create(['balance' => 2_000_000]);
        $auction = $this->liveAuction(endsAt: now()->subSecond());

        $this->actingAs($user)
            ->from("/auctions/{$auction->id}")
            ->post("/auctions/{$auction->id}/bids", ['amount' => 1_100_000])
            ->assertSessionHasErrors('amount');
    }

    public function test_bid_must_be_higher_than_current_price(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->create(['balance' => 2_000_000]);
        $auction = $this->liveAuction(currentPrice: 1_000_000);

        $this->actingAs($user)
            ->post("/auctions/{$auction->id}/bids", ['amount' => 1_000_000])
            ->assertSessionHasErrors('amount');
    }

    public function test_bid_must_follow_increment(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->create(['balance' => 2_000_000]);
        $auction = $this->liveAuction(currentPrice: 1_000_000);

        $this->actingAs($user)
            ->post("/auctions/{$auction->id}/bids", ['amount' => 1_050_000])
            ->assertSessionHasErrors('amount');
    }

    public function test_bid_requires_sufficient_wallet_balance(): void
    {
        $user = User::factory()->create();
        Wallet::factory()->for($user)->create(['balance' => 1_000_000]);
        $auction = $this->liveAuction(currentPrice: 1_000_000);

        $this->actingAs($user)
            ->post("/auctions/{$auction->id}/bids", ['amount' => 1_100_000])
            ->assertSessionHasErrors('amount');
    }

    private function liveAuction(
        AuctionStatus $status = AuctionStatus::Live,
        int $currentPrice = 1_000_000,
        mixed $endsAt = null,
    ): Auction {
        $greenBean = GreenBean::factory()->create([
            'starting_price' => 1_000_000,
            'bid_increment' => 100_000,
        ]);

        return Auction::factory()->for($greenBean)->create([
            'status' => $status,
            'current_price' => $currentPrice,
            'starts_at' => now()->subMinute(),
            'ends_at' => $endsAt ?? now()->addHour(),
        ]);
    }
}
