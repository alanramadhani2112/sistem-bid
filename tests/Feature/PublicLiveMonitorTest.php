<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\GreenBean;
use App\Models\User;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class PublicLiveMonitorTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_live_monitor_loads_without_auth(): void
    {
        $greenBean = GreenBean::factory()->create(['bid_increment' => 100_000]);
        $auction = Auction::factory()->for($greenBean)->live()->create(['current_price' => 1_000_000]);
        Bid::factory()->for($auction)->for(User::factory()->create(['email' => 'bidder@example.test', 'name' => 'Bidder A']))->create(['amount' => 1_100_000]);

        $this->get("/live/{$auction->id}/monitor")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/LiveMonitor')
                ->where('auction.id', $auction->id)
                ->where('auction.green_bean.bid_increment', 100_000)
                ->where('leaderboard.0.user.name', 'Bidder A')
                ->missing('leaderboard.0.user.email')
                ->has('bidHistory', 1));
    }

    public function test_draft_auction_monitor_is_not_public(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Draft]);

        $this->get("/live/{$auction->id}/monitor")->assertNotFound();
    }
}
