<?php

declare(strict_types=1);

namespace App\Modules\Bidding\Events;

use App\Models\Bid;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class BidPlaced implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(private readonly Bid $bid) {}

    public function broadcastAs(): string
    {
        return 'BidPlaced';
    }

    public function broadcastOn(): Channel
    {
        return new Channel("auction.{$this->bid->auction_id}");
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        $bid = $this->bid->loadMissing(['auction', 'user']);

        return [
            'bid' => [
                'id' => $bid->id,
                'amount' => $bid->amount,
                'bidder_name' => $bid->user->name,
                'placed_at' => $bid->created_at?->toISOString(),
            ],
            'auction' => [
                'id' => $bid->auction_id,
                'current_price' => $bid->auction->current_price,
                'leaderboard' => Bid::query()
                    ->with('user:id,name')
                    ->where('auction_id', $bid->auction_id)
                    ->orderByDesc('amount')
                    ->orderBy('created_at')
                    ->limit(5)
                    ->get()
                    ->map(fn (Bid $leaderBid): array => [
                        'id' => $leaderBid->id,
                        'amount' => $leaderBid->amount,
                        'bidder_name' => $leaderBid->user->name,
                    ])
                    ->values(),
            ],
        ];
    }
}
