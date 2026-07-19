<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\GreenBean;
use App\Models\User;
use App\Modules\Auctions\Events\AuctionClosed;
use App\Modules\Auctions\Services\AuctionWinnerService;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

final class AuctionWinnerTest extends TestCase
{
    use RefreshDatabase;

    public function test_highest_bid_wins_and_auction_closes(): void
    {
        Event::fake([AuctionClosed::class]);
        $auction = $this->endedAuction();
        $lowerUser = User::factory()->create();
        $higherUser = User::factory()->create();
        Bid::factory()->for($auction)->for($lowerUser)->create(['amount' => 1_100_000, 'created_at' => now()->subSeconds(2)]);
        $winningBid = Bid::factory()->for($auction)->for($higherUser)->create(['amount' => 1_200_000, 'created_at' => now()->subSecond()]);

        $winner = app(AuctionWinnerService::class)->closeAuction($auction);

        $this->assertNotNull($winner);
        $this->assertSame($higherUser->id, $winner->user_id);
        $this->assertSame($winningBid->id, $winner->bid_id);
        $this->assertSame(1_200_000, $winner->winning_amount);
        $this->assertSame(AuctionStatus::Closed, $auction->refresh()->status);
        Event::assertDispatched(AuctionClosed::class);
    }

    public function test_tie_uses_earlier_bid(): void
    {
        $auction = $this->endedAuction();
        $earlyUser = User::factory()->create();
        $lateUser = User::factory()->create();
        $earlyBid = Bid::factory()->for($auction)->for($earlyUser)->create(['amount' => 1_200_000, 'created_at' => now()->subSeconds(2)]);
        Bid::factory()->for($auction)->for($lateUser)->create(['amount' => 1_200_000, 'created_at' => now()->subSecond()]);

        $winner = app(AuctionWinnerService::class)->closeAuction($auction);

        $this->assertNotNull($winner);
        $this->assertSame($earlyBid->id, $winner->bid_id);
        $this->assertSame($earlyUser->id, $winner->user_id);
    }

    public function test_close_due_auctions_command_closes_only_due_live_auctions(): void
    {
        $dueAuction = $this->endedAuction();
        Bid::factory()->for($dueAuction)->for(User::factory()->create())->create(['amount' => 1_100_000]);
        $futureAuction = $this->liveAuction(endsAt: now()->addHour());
        $publishedAuction = $this->endedAuction(status: AuctionStatus::Published);

        $this->artisan('auctions:close-ended')
            ->expectsOutput('Closed 1 auction(s).')
            ->assertSuccessful();

        $this->assertSame(AuctionStatus::Closed, $dueAuction->refresh()->status);
        $this->assertSame(AuctionStatus::Live, $futureAuction->refresh()->status);
        $this->assertSame(AuctionStatus::Published, $publishedAuction->refresh()->status);
    }

    public function test_auction_without_bids_closes_without_winner(): void
    {
        $auction = $this->endedAuction();

        $winner = app(AuctionWinnerService::class)->closeAuction($auction);

        $this->assertNull($winner);
        $this->assertSame(AuctionStatus::Closed, $auction->refresh()->status);
        $this->assertDatabaseMissing('auction_winners', ['auction_id' => $auction->id]);
    }

    private function endedAuction(AuctionStatus $status = AuctionStatus::Live): Auction
    {
        return $this->liveAuction($status, now()->subSecond());
    }

    private function liveAuction(AuctionStatus $status = AuctionStatus::Live, mixed $endsAt = null): Auction
    {
        $greenBean = GreenBean::factory()->create([
            'starting_price' => 1_000_000,
            'bid_increment' => 100_000,
        ]);

        return Auction::factory()->for($greenBean)->create([
            'status' => $status,
            'current_price' => 1_000_000,
            'starts_at' => now()->subHour(),
            'ends_at' => $endsAt ?? now()->addHour(),
        ]);
    }
}
