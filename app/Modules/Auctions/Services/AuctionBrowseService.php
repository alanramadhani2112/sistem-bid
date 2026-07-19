<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Services;

use App\Models\Auction;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class AuctionBrowseService
{
    /** @return Collection<int, Auction> */
    public function visibleAuctions(): Collection
    {
        return $this->visibleQuery()
            ->with('greenBean:id,name,origin,process,weight_gram,image_path,bid_increment')
            ->orderByRaw("case status when 'live' then 0 when 'published' then 1 else 2 end")
            ->orderBy('starts_at')
            ->get(['id', 'green_bean_id', 'title', 'status', 'current_price', 'starts_at', 'ends_at']);
    }

    public function visibleAuction(Auction $auction): Auction
    {
        return $this->visibleQuery()
            ->with('greenBean:id,name,origin,process,weight_gram,description,image_path,starting_price,bid_increment')
            ->findOrFail($auction->id);
    }

    /** @return array<string, mixed> */
    public function liveRoom(Auction $auction): array
    {
        $roomAuction = $this->visibleAuction($auction)->load([
            'bids' => fn ($query) => $query->with('user:id,name')->latest()->limit(20),
        ]);

        abort_unless($roomAuction->status === AuctionStatus::Live, 404);

        $leaderboard = $roomAuction->bids()
            ->with('user:id,name')
            ->orderByDesc('amount')
            ->orderBy('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($bid): array => [
                'id' => $bid->id,
                'amount' => $bid->amount,
                'bidder_name' => $bid->user->name,
            ])
            ->values();

        return [
            'auction' => $roomAuction,
            'bidHistory' => $roomAuction->bids->map(fn ($bid): array => [
                'id' => $bid->id,
                'amount' => $bid->amount,
                'bidder_name' => $bid->user->name,
                'placed_at' => $bid->created_at?->toISOString(),
            ])->values(),
            'leaderboard' => $leaderboard,
        ];
    }

    /** @return Builder<Auction> */
    private function visibleQuery(): Builder
    {
        return Auction::query()->whereIn('status', [
            AuctionStatus::Published,
            AuctionStatus::Live,
            AuctionStatus::Closed,
        ]);
    }
}
