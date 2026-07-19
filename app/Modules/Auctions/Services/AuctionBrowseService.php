<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Services;

use App\Models\Auction;
use App\Models\Bid;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class AuctionBrowseService
{
    /** @return array<string, mixed> */
    public function liveAuctionLobby(): array
    {
        $auctions = $this->visibleAuctions();
        $liveAuction = $auctions->first(fn (Auction $auction): bool => $auction->status === AuctionStatus::Live);

        return [
            'auctions' => $auctions->map(fn (Auction $auction): array => $this->auctionCardData($auction))->values(),
            'liveAuction' => $liveAuction instanceof Auction ? $this->auctionCardData($liveAuction) : null,
            'latestBids' => Bid::query()
                ->with(['auction:id,title', 'user:id,name'])
                ->latest()
                ->limit(8)
                ->get(['id', 'auction_id', 'user_id', 'amount', 'created_at'])
                ->map(fn (Bid $bid): array => [
                    'id' => $bid->id,
                    'amount' => $bid->amount,
                    'auction_title' => $bid->auction?->title,
                    'bidder_name' => $bid->user?->name,
                    'placed_at' => $bid->created_at?->toISOString(),
                ])
                ->values(),
        ];
    }

    /** @return Collection<int, Auction> */
    public function visibleAuctions(): Collection
    {
        return $this->visibleQuery()
            ->with('greenBean:id,name,origin,process,weight_gram,image_path,bid_increment')
            ->orderByRaw("case status when 'live' then 0 when 'published' then 1 else 2 end")
            ->orderBy('starts_at')
            ->get(['id', 'green_bean_id', 'title', 'status', 'current_price', 'starts_at', 'ends_at']);
    }

    /** @return array<string, mixed> */
    private function auctionCardData(Auction $auction): array
    {
        $leader = $auction->bids()
            ->with('user:id,name')
            ->orderByDesc('amount')
            ->orderBy('created_at')
            ->first();

        return [
            'id' => $auction->id,
            'title' => $auction->title,
            'status' => $auction->status,
            'current_price' => $auction->current_price,
            'starts_at' => $auction->starts_at?->toISOString(),
            'ends_at' => $auction->ends_at?->toISOString(),
            'bid_count' => $auction->bids()->count(),
            'leader_name' => $leader?->user?->name,
            'green_bean' => [
                'name' => $auction->greenBean?->name,
                'origin' => $auction->greenBean?->origin,
                'process' => $auction->greenBean?->process,
                'weight_gram' => $auction->greenBean?->weight_gram,
            ],
        ];
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
