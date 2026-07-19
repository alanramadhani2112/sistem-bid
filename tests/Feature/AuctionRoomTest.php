<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\GreenBean;
use App\Models\User;
use App\Modules\Bidding\Events\BidPlaced;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class AuctionRoomTest extends TestCase
{
    use RefreshDatabase;

    public function test_live_room_requires_auth(): void
    {
        $auction = Auction::factory()->live()->create();

        $this->get("/auctions/{$auction->id}/room")->assertRedirect('/login');
    }

    public function test_user_can_open_live_room(): void
    {
        $user = User::factory()->create();
        $auction = Auction::factory()->live()->create();
        Bid::factory()->for($auction)->for(User::factory()->create(['name' => 'Bidder A']))->create(['amount' => 1_100_000]);

        $this->actingAs($user)
            ->get("/auctions/{$auction->id}/room")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Auctions/Room')
                ->where('auction.id', $auction->id)
                ->has('leaderboard', 1)
                ->has('bidHistory', 1));
    }

    public function test_non_live_room_returns_not_found(): void
    {
        $user = User::factory()->create();
        $auction = Auction::factory()->create(['status' => AuctionStatus::Published]);

        $this->actingAs($user)->get("/auctions/{$auction->id}/room")->assertNotFound();
    }

    public function test_bid_dispatches_bid_placed_event(): void
    {
        Event::fake([BidPlaced::class]);

        $user = User::factory()->create();
        $user->wallet()->create(['balance' => 2_000_000]);
        $greenBean = GreenBean::factory()->create([
            'starting_price' => 1_000_000,
            'bid_increment' => 100_000,
        ]);
        $auction = Auction::factory()->for($greenBean)->live()->create(['current_price' => 1_000_000]);

        $this->actingAs($user)->post("/auctions/{$auction->id}/bids", ['amount' => 1_100_000])->assertRedirect();

        Event::assertDispatched(BidPlaced::class);
    }
}
