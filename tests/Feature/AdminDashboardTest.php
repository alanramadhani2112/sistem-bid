<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\AuctionWinner;
use App\Models\Bid;
use App\Models\GreenBean;
use App\Models\User;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_dashboard(): void
    {
        $admin = User::factory()->admin()->create();
        GreenBean::factory()->create();
        Auction::factory()->create(['status' => AuctionStatus::Published]);

        $this->actingAs($admin)
            ->get('/admin/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->has('stats')
                ->has('auctionsByStatus'));
    }

    public function test_bidder_cannot_open_admin_dashboard(): void
    {
        $bidder = User::factory()->create();

        $this->actingAs($bidder)->get('/admin/dashboard')->assertForbidden();
    }

    public function test_admin_can_open_auction_monitor(): void
    {
        $admin = User::factory()->admin()->create();
        $auction = Auction::factory()->live()->create();
        Bid::factory()->for($auction)->for(User::factory()->create(['name' => 'Bidder A']))->create(['amount' => 1_100_000]);

        $this->actingAs($admin)
            ->get("/admin/auctions/{$auction->id}/monitor")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Auctions/Monitor')
                ->where('auction.id', $auction->id)
                ->has('leaderboard', 1)
                ->has('bidHistory', 1));
    }

    public function test_admin_can_open_users_page(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->create()->wallet()->create(['balance' => 500_000]);

        $this->actingAs($admin)
            ->get('/admin/users')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('stats')
                ->has('users', 2));
    }

    public function test_admin_can_open_winners_page(): void
    {
        $admin = User::factory()->admin()->create();
        $winnerUser = User::factory()->create(['name' => 'Winner A']);
        $auction = Auction::factory()->create(['status' => AuctionStatus::Closed]);
        $bid = Bid::factory()->for($auction)->for($winnerUser)->create(['amount' => 1_200_000]);
        AuctionWinner::factory()->for($auction)->for($winnerUser, 'user')->for($bid, 'bid')->create(['winning_amount' => 1_200_000]);

        $this->actingAs($admin)
            ->get('/admin/winners')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Winners/Index')
                ->has('winners', 1));
    }
}
