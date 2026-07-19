<?php

declare(strict_types=1);

namespace App\Modules\Auctions\Services;

use App\Models\Auction;
use App\Models\AuctionWinner;
use App\Models\Bid;
use App\Modules\Auctions\Events\AuctionClosed;
use App\Modules\Shared\Enums\AuctionStatus;
use Illuminate\Support\Facades\DB;

final class AuctionWinnerService
{
    public function closeDueAuctions(): int
    {
        $count = 0;

        Auction::query()
            ->where('status', AuctionStatus::Live)
            ->where('ends_at', '<=', now())
            ->orderBy('ends_at')
            ->each(function (Auction $auction) use (&$count): void {
                $this->closeAuction($auction);
                $count++;
            });

        return $count;
    }

    public function closeAuction(Auction $auction): ?AuctionWinner
    {
        [$closedAuction, $winner] = DB::transaction(function () use ($auction): array {
            /** @var Auction $lockedAuction */
            $lockedAuction = Auction::query()->lockForUpdate()->findOrFail($auction->id);

            if ($lockedAuction->status === AuctionStatus::Closed) {
                return [$lockedAuction, $lockedAuction->winner()->first()];
            }

            $winningBid = Bid::query()
                ->where('auction_id', $lockedAuction->id)
                ->orderByDesc('amount')
                ->orderBy('created_at')
                ->orderBy('id')
                ->first();

            $winner = null;

            if ($winningBid !== null) {
                $winner = AuctionWinner::query()->firstOrCreate(
                    ['auction_id' => $lockedAuction->id],
                    [
                        'user_id' => $winningBid->user_id,
                        'bid_id' => $winningBid->id,
                        'winning_amount' => $winningBid->amount,
                        'determined_at' => now(),
                    ],
                );
            }

            $lockedAuction->update(['status' => AuctionStatus::Closed]);

            return [$lockedAuction->refresh(), $winner];
        });

        AuctionClosed::dispatch($closedAuction, $winner);

        return $winner;
    }
}
