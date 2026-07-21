<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Events;

use App\Models\Auction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class AuctionStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(private readonly Auction $auction) {}

    public function broadcastAs(): string
    {
        return 'AuctionStatusChanged';
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
        $auction = $this->auction->loadMissing('greenBean:id,name,origin,process,weight_gram,image_path,bid_increment');

        return [
            'auction' => [
                'id' => $auction->id,
                'title' => $auction->title,
                'status' => $auction->status->value,
                'current_price' => $auction->current_price,
                'starts_at' => $auction->starts_at?->toISOString(),
                'ends_at' => $auction->ends_at?->toISOString(),
                'green_bean' => [
                    'name' => $auction->greenBean?->name,
                    'origin' => $auction->greenBean?->origin,
                    'process' => $auction->greenBean?->process,
                    'weight_gram' => $auction->greenBean?->weight_gram,
                    'image_path' => $auction->greenBean?->image_path,
                    'bid_increment' => $auction->greenBean?->bid_increment,
                ],
            ],
        ];
    }
}
