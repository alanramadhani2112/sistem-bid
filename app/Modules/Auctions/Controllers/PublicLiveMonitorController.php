<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Controllers;

use App\Models\Auction;
use App\Modules\Shared\Enums\AuctionStatus;
use Inertia\Inertia;
use Inertia\Response;

final class PublicLiveMonitorController
{
    public function show(Auction $auction): Response
    {
        abort_if($auction->status === AuctionStatus::Draft, 404);

        $auction->load('greenBean:id,name,origin,process,weight_gram,image_path,bid_increment');

        return Inertia::render('Public/LiveMonitor', [
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
        ]);
    }
}
