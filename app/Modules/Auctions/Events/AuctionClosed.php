<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Events;

use App\Models\Auction;
use App\Models\AuctionWinner;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class AuctionClosed implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(
        private readonly Auction $auction,
        private readonly ?AuctionWinner $winner,
    ) {}

    public function broadcastAs(): string
    {
        return 'AuctionClosed';
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('auctions'),
            new Channel("auction.{$this->auction->id}"),
        ];
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        $winner = $this->winner?->loadMissing('user:id,name');

        return [
            'auction' => [
                'id' => $this->auction->id,
                'title' => $this->auction->title,
                'status' => $this->auction->status->value,
                'current_price' => $this->auction->current_price,
                'starts_at' => $this->auction->starts_at?->toISOString(),
                'ends_at' => $this->auction->ends_at?->toISOString(),
            ],
            'winner' => $winner ? [
                'user_id' => $winner->user_id,
                'bid_id' => $winner->bid_id,
                'bidder_name' => $winner->user->name,
                'winning_amount' => $winner->winning_amount,
                'determined_at' => $winner->determined_at?->toISOString(),
            ] : null,
        ];
    }
}
