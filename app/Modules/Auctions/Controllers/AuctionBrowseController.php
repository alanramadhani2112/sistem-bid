<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Controllers;

use App\Models\Auction;
use App\Modules\Auctions\Services\AuctionBrowseService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class AuctionBrowseController
{
    public function index(AuctionBrowseService $auctionBrowseService): Response
    {
        return Inertia::render('Auctions/Index', [
            'auctions' => $auctionBrowseService->visibleAuctions(),
        ]);
    }

    public function show(Auction $auction, AuctionBrowseService $auctionBrowseService): Response
    {
        return Inertia::render('Auctions/Show', [
            'auction' => $auctionBrowseService->visibleAuction($auction),
        ]);
    }

    public function room(Auction $auction, AuctionBrowseService $auctionBrowseService, Request $request): Response
    {
        return Inertia::render('Auctions/Room', $auctionBrowseService->liveRoom($auction, $request->user()?->id));
    }
}
