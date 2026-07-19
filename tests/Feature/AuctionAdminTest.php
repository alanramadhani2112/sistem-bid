<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\GreenBean;
use App\Models\User;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class AuctionAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_auction_index(): void
    {
        Auction::factory()->create();

        $this->actingAs($this->admin())
            ->get('/admin/auctions')
            ->assertOk();
    }

    public function test_bidder_cannot_access_auction_admin(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/auctions')
            ->assertForbidden();
    }

    public function test_admin_can_create_auction_with_current_price_from_green_bean(): void
    {
        $greenBean = GreenBean::factory()->create(['starting_price' => 1_250_000]);

        $this->actingAs($this->admin())
            ->post('/admin/auctions', $this->payload($greenBean))
            ->assertRedirect('/admin/auctions');

        $this->assertDatabaseHas('auctions', [
            'current_price' => 1_250_000,
            'green_bean_id' => $greenBean->id,
            'status' => AuctionStatus::Draft->value,
            'title' => 'Auction Gayo',
        ]);
    }

    public function test_admin_can_update_draft_auction(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Draft]);

        $this->actingAs($this->admin())
            ->put("/admin/auctions/{$auction->id}", $this->payload($auction->greenBean, ['title' => 'Updated Auction']))
            ->assertRedirect('/admin/auctions');

        $this->assertDatabaseHas('auctions', [
            'id' => $auction->id,
            'title' => 'Updated Auction',
        ]);
    }

    public function test_live_auction_cannot_be_edited_or_deleted(): void
    {
        $auction = Auction::factory()->live()->create();

        $this->actingAs($this->admin())
            ->put("/admin/auctions/{$auction->id}", $this->payload($auction->greenBean))
            ->assertSessionHasErrors('status');

        $this->actingAs($this->admin())
            ->delete("/admin/auctions/{$auction->id}")
            ->assertSessionHasErrors('status');

        $this->assertDatabaseHas('auctions', ['id' => $auction->id]);
    }

    public function test_admin_can_move_published_auction_to_live_then_closed(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Published]);

        $this->actingAs($this->admin())
            ->patch("/admin/auctions/{$auction->id}/status", ['status' => AuctionStatus::Live->value])
            ->assertRedirect('/admin/auctions');

        $this->assertDatabaseHas('auctions', [
            'id' => $auction->id,
            'status' => AuctionStatus::Live->value,
        ]);

        $this->actingAs($this->admin())
            ->patch("/admin/auctions/{$auction->id}/status", ['status' => AuctionStatus::Closed->value])
            ->assertRedirect('/admin/auctions');

        $this->assertDatabaseHas('auctions', [
            'id' => $auction->id,
            'status' => AuctionStatus::Closed->value,
        ]);
    }

    public function test_invalid_status_transition_is_rejected(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Draft]);

        $this->actingAs($this->admin())
            ->patch("/admin/auctions/{$auction->id}/status", ['status' => AuctionStatus::Live->value])
            ->assertSessionHasErrors('status');
    }

    public function test_auction_payload_is_validated(): void
    {
        $greenBean = GreenBean::factory()->create();

        $this->actingAs($this->admin())
            ->post('/admin/auctions', $this->payload($greenBean, ['ends_at' => now()->toDateTimeString()]))
            ->assertSessionHasErrors('ends_at');
    }

    public function test_quick_action_draft_to_published(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Draft]);

        $this->actingAs($this->admin())
            ->patch("/admin/auctions/{$auction->id}/status", ['status' => 'published'])
            ->assertRedirect();

        $this->assertDatabaseHas('auctions', ['id' => $auction->id, 'status' => 'published']);
    }

    public function test_quick_action_published_to_live(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Published]);

        $this->actingAs($this->admin())
            ->patch("/admin/auctions/{$auction->id}/status", ['status' => 'live'])
            ->assertRedirect();

        $this->assertDatabaseHas('auctions', ['id' => $auction->id, 'status' => 'live']);
    }

    public function test_quick_action_live_to_closed(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Live]);

        $this->actingAs($this->admin())
            ->patch("/admin/auctions/{$auction->id}/status", ['status' => 'closed'])
            ->assertRedirect();

        $this->assertDatabaseHas('auctions', ['id' => $auction->id, 'status' => 'closed']);
    }

    public function test_quick_action_revert_published_to_draft(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Published]);

        $this->actingAs($this->admin())
            ->patch("/admin/auctions/{$auction->id}/status", ['status' => 'draft'])
            ->assertRedirect();

        $this->assertDatabaseHas('auctions', ['id' => $auction->id, 'status' => 'draft']);
    }

    public function test_quick_action_invalid_draft_to_live_rejected(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Draft]);

        $this->actingAs($this->admin())
            ->patch("/admin/auctions/{$auction->id}/status", ['status' => 'live'])
            ->assertRedirect();

        $this->assertDatabaseHas('auctions', ['id' => $auction->id, 'status' => 'draft']);
    }

    public function test_index_page_renders_for_admin(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin/auctions')
            ->assertOk();
    }

    public function test_admin_can_manually_close_live_auction(): void
    {
        $auction = Auction::factory()->live()->create();
        $bidder = User::factory()->create();
        Bid::factory()->for($auction)->for($bidder)->create(['amount' => 1_500_000]);

        $this->actingAs($this->admin())
            ->post("/admin/auctions/{$auction->id}/close")
            ->assertRedirect();

        $this->assertDatabaseHas('auctions', ['id' => $auction->id, 'status' => 'closed']);
        $this->assertDatabaseHas('auction_winners', ['auction_id' => $auction->id, 'user_id' => $bidder->id]);
    }

    public function test_non_live_auction_cannot_be_manually_closed(): void
    {
        $auction = Auction::factory()->create(['status' => AuctionStatus::Draft]);

        $this->actingAs($this->admin())
            ->post("/admin/auctions/{$auction->id}/close")
            ->assertSessionHasErrors('status');

        $this->assertDatabaseHas('auctions', ['id' => $auction->id, 'status' => 'draft']);
    }

    public function test_bidder_cannot_manually_close_auction(): void
    {
        $auction = Auction::factory()->live()->create();

        $this->actingAs(User::factory()->create())
            ->post("/admin/auctions/{$auction->id}/close")
            ->assertForbidden();
    }

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    /** @param array<string, mixed> $overrides */
    private function payload(GreenBean $greenBean, array $overrides = []): array
    {
        return array_merge([
            'ends_at' => now()->addHours(3)->toDateTimeString(),
            'green_bean_id' => $greenBean->id,
            'starts_at' => now()->addHour()->toDateTimeString(),
            'status' => AuctionStatus::Draft->value,
            'title' => 'Auction Gayo',
        ], $overrides);
    }
}
