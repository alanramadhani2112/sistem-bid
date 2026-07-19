<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Controllers;

use App\Models\Auction;
use App\Models\GreenBean;
use App\Modules\Auctions\Requests\AuctionRequest;
use App\Modules\Auctions\Requests\AuctionStatusRequest;
use App\Modules\Auctions\Services\AuctionService;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class AuctionController
{
    public function index(): Response
    {
        return Inertia::render('Admin/Auctions/Index', [
            'auctions' => Auction::query()
                ->with('greenBean:id,name,origin')
                ->latest()
                ->get(['id', 'green_bean_id', 'title', 'status', 'current_price', 'starts_at', 'ends_at']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Auctions/Form', [
            'auction' => null,
            'greenBeans' => $this->greenBeanOptions(),
            'statuses' => [AuctionStatus::Draft->value, AuctionStatus::Published->value],
        ]);
    }

    public function store(AuctionRequest $request, AuctionService $auctionService): RedirectResponse
    {
        $auctionService->create($request->validated());

        return redirect()->route('admin.auctions.index');
    }

    public function edit(Auction $auction): Response
    {
        return Inertia::render('Admin/Auctions/Form', [
            'auction' => [
                'id' => $auction->id,
                'green_bean_id' => $auction->green_bean_id,
                'title' => $auction->title,
                'status' => $auction->status->value,
                'starts_at' => $auction->starts_at->format('Y-m-d\TH:i'),
                'ends_at' => $auction->ends_at->format('Y-m-d\TH:i'),
            ],
            'greenBeans' => $this->greenBeanOptions(),
            'statuses' => [AuctionStatus::Draft->value, AuctionStatus::Published->value],
        ]);
    }

    public function update(AuctionRequest $request, Auction $auction, AuctionService $auctionService): RedirectResponse
    {
        $auctionService->update($auction, $request->validated());

        return redirect()->route('admin.auctions.index');
    }

    public function destroy(Auction $auction, AuctionService $auctionService): RedirectResponse
    {
        $auctionService->delete($auction);

        return redirect()->route('admin.auctions.index');
    }

    public function status(AuctionStatusRequest $request, Auction $auction, AuctionService $auctionService): RedirectResponse
    {
        $auctionService->changeStatus($auction, AuctionStatus::from($request->validated('status')));

        return redirect()->route('admin.auctions.index');
    }

    /** @return Collection<int, GreenBean> */
    private function greenBeanOptions(): Collection
    {
        return GreenBean::query()
            ->orderBy('name')
            ->get(['id', 'name', 'origin', 'starting_price', 'bid_increment']);
    }
}
