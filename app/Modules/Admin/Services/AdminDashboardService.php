<?php

declare(strict_types=1);

namespace App\Modules\Admin\Services;

use App\Models\Auction;
use App\Models\AuctionWinner;
use App\Models\Bid;
use App\Models\GreenBean;
use App\Models\User;
use App\Modules\Shared\Enums\AuctionStatus;
use App\Modules\Shared\Enums\UserRole;

final class AdminDashboardService
{
    /** @return array<string, mixed> */
    public function dashboard(): array
    {
        return [
            'stats' => [
                'users' => User::query()->count(),
                'greenBeans' => GreenBean::query()->count(),
                'auctions' => Auction::query()->count(),
                'bids' => Bid::query()->count(),
                'winners' => AuctionWinner::query()->count(),
            ],
            'auctionsByStatus' => collect(AuctionStatus::cases())
                ->mapWithKeys(fn (AuctionStatus $status) => [
                    $status->value => Auction::query()->where('status', $status)->count(),
                ]),
            'recentAuctions' => Auction::query()
                ->with('greenBean:id,name,origin')
                ->latest()
                ->limit(5)
                ->get(['id', 'green_bean_id', 'title', 'status', 'current_price', 'starts_at', 'ends_at']),
            'liveAuctions' => Auction::query()
                ->with('greenBean:id,name,origin')
                ->where('status', AuctionStatus::Live)
                ->orderBy('ends_at')
                ->limit(6)
                ->get(['id', 'green_bean_id', 'title', 'status', 'current_price', 'starts_at', 'ends_at'])
                ->map(fn (Auction $auction): array => $this->controlAuctionData($auction))
                ->values(),
            'upcomingAuctions' => Auction::query()
                ->with('greenBean:id,name,origin')
                ->where('status', AuctionStatus::Published)
                ->orderBy('starts_at')
                ->limit(6)
                ->get(['id', 'green_bean_id', 'title', 'status', 'current_price', 'starts_at', 'ends_at'])
                ->map(fn (Auction $auction): array => $this->controlAuctionData($auction))
                ->values(),
            'recentBids' => Bid::query()
                ->with(['auction:id,title', 'user:id,name'])
                ->latest()
                ->limit(8)
                ->get(['id', 'auction_id', 'user_id', 'amount', 'created_at'])
                ->map(fn (Bid $bid): array => [
                    'id' => $bid->id,
                    'amount' => $bid->amount,
                    'bidder_name' => trim(($bid->user?->name ?? 'Bidder').' · '.($bid->auction?->title ?? 'Auction')),
                    'placed_at' => $bid->created_at?->toISOString(),
                ])
                ->values(),
        ];
    }

    /** @return array<string, mixed> */
    private function controlAuctionData(Auction $auction): array
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
            ],
        ];
    }

    /** @return array<string, mixed> */
    public function monitor(Auction $auction): array
    {
        $auction->load('greenBean:id,name,origin,process,weight_gram');

        return [
            'auction' => $auction->only(['id', 'title', 'status', 'current_price', 'starts_at', 'ends_at']) + [
                'green_bean' => $auction->greenBean,
            ],
            'leaderboard' => $auction->bids()
                ->with('user:id,name')
                ->orderByDesc('amount')
                ->orderBy('created_at')
                ->limit(10)
                ->get(['id', 'auction_id', 'user_id', 'amount', 'created_at']),
            'bidHistory' => $auction->bids()
                ->with('user:id,name')
                ->latest()
                ->limit(20)
                ->get(['id', 'auction_id', 'user_id', 'amount', 'created_at']),
        ];
    }

    /** @return array<string, mixed> */
    public function users(): array
    {
        return [
            'stats' => [
                'admins' => User::query()->where('role', UserRole::Admin)->count(),
                'bidders' => User::query()->where('role', UserRole::Bidder)->count(),
            ],
            'users' => User::query()
                ->with('wallet:id,user_id,balance')
                ->latest()
                ->limit(50)
                ->get(['id', 'name', 'email', 'avatar', 'role', 'created_at']),
        ];
    }

    /** @return array<string, mixed> */
    public function winners(): array
    {
        return [
            'winners' => AuctionWinner::query()
                ->with([
                    'auction:id,title,status,current_price,green_bean_id',
                    'auction.greenBean:id,name,origin',
                    'user:id,name,email',
                    'bid:id,amount,created_at',
                ])
                ->latest('determined_at')
                ->limit(50)
                ->get(['id', 'auction_id', 'user_id', 'bid_id', 'winning_amount', 'determined_at']),
        ];
    }

    /** @return array<string, mixed> */
    public function userWallet(User $user): array
    {
        $wallet = $user->wallet()
            ->with(['transactions' => fn ($q) => $q->latest('created_at')->limit(50)])
            ->first();

        return [
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'wallet' => $wallet
                ? $wallet->only(['id', 'balance'])
                : ['id' => null, 'balance' => 0],
            'transactions' => $wallet
                ? $wallet->transactions->map(fn ($tx) => $tx->only(['id', 'type', 'amount', 'balance_before', 'balance_after', 'reference', 'notes', 'created_at']))
                : [],
        ];
    }
}
