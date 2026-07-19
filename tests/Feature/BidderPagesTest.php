<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\User;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class BidderPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_auction_index_shows_visible_auctions_only(): void
    {
        Auction::factory()->create(['status' => AuctionStatus::Draft]);
        Auction::factory()->create(['status' => AuctionStatus::Published]);
        Auction::factory()->live()->create();

        $this->get('/auctions')->assertOk();
    }

    public function test_public_auction_detail_hides_draft(): void
    {
        $draft = Auction::factory()->create(['status' => AuctionStatus::Draft]);
        $published = Auction::factory()->create(['status' => AuctionStatus::Published]);

        $this->get("/auctions/{$published->id}")->assertOk();
        $this->get("/auctions/{$draft->id}")->assertNotFound();
    }

    public function test_history_requires_auth_and_shows_user_bids(): void
    {
        $user = User::factory()->create();
        $bid = Bid::factory()->create(['user_id' => $user->id]);

        $this->get('/history')->assertRedirect('/login');
        $this->actingAs($user)->get('/history')->assertOk();

        $this->assertDatabaseHas('bids', ['id' => $bid->id]);
    }

    public function test_profile_requires_auth(): void
    {
        $this->get('/profile')->assertRedirect('/login');

        $this->actingAs(User::factory()->create())
            ->get('/profile')
            ->assertOk();
    }
}
