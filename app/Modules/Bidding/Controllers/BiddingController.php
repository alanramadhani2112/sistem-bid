<?php

declare(strict_types=1);

namespace App\Modules\Bidding\Controllers;

use App\Models\Auction;
use App\Modules\Bidding\Requests\PlaceBidRequest;
use App\Modules\Bidding\Services\BiddingService;
use Illuminate\Http\RedirectResponse;

final class BiddingController
{
    public function store(PlaceBidRequest $request, Auction $auction, BiddingService $biddingService): RedirectResponse
    {
        $biddingService->placeBid($auction, $request->user(), (int) $request->validated('amount'));

        return back()->with('success', 'Bid masuk.');
    }
}
